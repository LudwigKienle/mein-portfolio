import React, { useCallback, useMemo, useState } from 'react';

const STATUS_LABELS = {
  starting: 'Wird gestartet…',
  processing: 'Verarbeitung läuft…',
  succeeded: 'Fertig!',
  failed: 'Fehlgeschlagen',
  canceled: 'Abgebrochen',
};

const DEFAULT_GUIDANCE = 7;

const resolveStatusLabel = (status) => STATUS_LABELS[status] ?? status;

const parseOutput = (output) => {
  if (!output) return [];
  if (Array.isArray(output)) return output;
  if (typeof output === 'string') return [output];
  return Object.values(output).flat();
};

const buildErrorMessage = async (response) => {
  try {
    const payload = await response.json();
    if (payload?.detail) {
      if (typeof payload.detail === 'string') return payload.detail;
      if (Array.isArray(payload.detail)) {
        return payload.detail.map((item) => item.msg ?? JSON.stringify(item)).join('\n');
      }
      return JSON.stringify(payload.detail);
    }
    return JSON.stringify(payload);
  } catch (error) {
    return `Unbekannter Fehler (${response.status})`;
  }
};

export default function VideoEditor() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [modelVersion, setModelVersion] = useState('');
  const [guidance, setGuidance] = useState(DEFAULT_GUIDANCE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [outputs, setOutputs] = useState([]);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const replicateToken = process.env.REACT_APP_REPLICATE_API_TOKEN;

  const guidanceRange = useMemo(() => ({ min: 1, max: 30 }), []);

  const pollPrediction = useCallback(async (predictionUrl) => {
    let currentPredictionUrl = predictionUrl;
    while (currentPredictionUrl) {
      const pollResponse = await fetch(currentPredictionUrl, {
        headers: {
          Authorization: `Bearer ${replicateToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!pollResponse.ok) {
        const message = await buildErrorMessage(pollResponse);
        throw new Error(message);
      }

      const pollData = await pollResponse.json();
      setStatus(pollData.status ?? '');
      setProgress(pollData.metrics?.progress ?? 0);

      if (['succeeded', 'failed', 'canceled'].includes(pollData.status)) {
        if (pollData.status === 'succeeded') {
          setOutputs(parseOutput(pollData.output));
        } else {
          throw new Error(pollData.error ?? 'Die Vorhersage konnte nicht abgeschlossen werden.');
        }
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 2500));
      currentPredictionUrl = pollData.urls?.get ?? currentPredictionUrl;
    }
  }, [replicateToken]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setError('');
    setOutputs([]);
    setProgress(0);
    setStatus('starting');

    if (!replicateToken) {
      setError('Kein Replicate API-Token gefunden. Bitte setzen Sie REACT_APP_REPLICATE_API_TOKEN in Ihrer .env-Datei.');
      setStatus('');
      return;
    }

    if (!modelVersion) {
      setError('Bitte geben Sie die Version des gewünschten Replicate-Modells an.');
      setStatus('');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${replicateToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: modelVersion,
          input: {
            prompt,
            ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
            ...(videoUrl ? { video: videoUrl } : {}),
            guidance_scale: Number(guidance),
          },
        }),
      });

      if (!response.ok) {
        const message = await buildErrorMessage(response);
        throw new Error(message);
      }

      const prediction = await response.json();
      setStatus(prediction.status ?? 'processing');
      setProgress(prediction.metrics?.progress ?? 0);

      const predictionUrl = prediction.urls?.get;
      if (predictionUrl) {
        await pollPrediction(predictionUrl);
      } else if (prediction.output) {
        setOutputs(parseOutput(prediction.output));
        setStatus(prediction.status ?? 'succeeded');
      }
    } catch (submitError) {
      setError(submitError.message ?? 'Es ist ein unbekannter Fehler aufgetreten.');
      setStatus('failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [guidance, modelVersion, negativePrompt, pollPrediction, prompt, replicateToken, videoUrl]);

  return (
    <section id="video-editor" className="py-20 sm:py-32 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-16">
          <div className="flex-1 mb-12 lg:mb-0">
            <h2 className="text-4xl font-bold text-white mb-4">KI Video Studio</h2>
            <p className="text-lg text-gray-300 mb-6">
              Bearbeiten Sie Ihre Clips mit modernsten Replicate-Modellen. Kombinieren Sie kreative Texteingaben mit einem
              Referenzvideo, um in wenigen Minuten neue Looks, Animationen oder stilisierte Sequenzen zu erzeugen.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 font-semibold mr-2">01</span>
                Beschreiben Sie die gewünschte Stimmung oder Aktion als Prompt.
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 font-semibold mr-2">02</span>
                Verlinken Sie optional ein Ausgangsvideo (z. B. aus Ihrem CDN oder von einer öffentlich zugänglichen URL).
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 font-semibold mr-2">03</span>
                Hinterlegen Sie die Modell-Version aus Ihrem Replicate-Dashboard und starten Sie die Generierung.
              </li>
            </ul>
            <p className="mt-8 text-sm text-gray-500">
              Tipp: Legen Sie unterschiedliche Modell-Versionen als Favoriten an, um zwischen Stiltransfers, Bewegungserweiterung
              oder Frame-Interpolation zu wechseln.
            </p>
          </div>

          <div className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-black/30 p-6 lg:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="prompt" className="block text-sm font-semibold text-gray-200 mb-2">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  required
                  rows={4}
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Futuristischer Neon-Look, dynamische Kamerafahrt, viel Partikellicht"
                />
              </div>

              <div>
                <label htmlFor="videoUrl" className="block text-sm font-semibold text-gray-200 mb-2">
                  Video-URL (optional)
                </label>
                <input
                  id="videoUrl"
                  type="url"
                  value={videoUrl}
                  onChange={(event) => setVideoUrl(event.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Das Video muss öffentlich abrufbar sein. Verwenden Sie vorzugsweise MP4-Dateien mit weniger als 100 MB.
                </p>
              </div>

              <div>
                <label htmlFor="modelVersion" className="block text-sm font-semibold text-gray-200 mb-2">
                  Replicate Modell-Version
                </label>
                <input
                  id="modelVersion"
                  type="text"
                  required
                  value={modelVersion}
                  onChange={(event) => setModelVersion(event.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="z. B. 7de2ea26c616d5bf2245ad0d3c3c63c1ec6609d6cd9536cdac38916d3c8dc55c"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Die Versions-ID finden Sie auf replicate.com im Bereich &ldquo;Versions&rdquo; des jeweiligen Modells.
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced((value) => !value)}
                  className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showAdvanced ? 'Erweiterte Einstellungen verbergen' : 'Erweiterte Einstellungen anzeigen'}
                </button>
                {showAdvanced && (
                  <div className="mt-4 space-y-4 bg-gray-900 border border-gray-700 rounded-xl p-4">
                    <div>
                      <label htmlFor="negativePrompt" className="block text-xs font-semibold text-gray-300 mb-2">
                        Negative Prompt
                      </label>
                      <textarea
                        id="negativePrompt"
                        rows={3}
                        value={negativePrompt}
                        onChange={(event) => setNegativePrompt(event.target.value)}
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Unwanted artifacts, low quality, motion blur"
                      />
                    </div>
                    <div>
                      <label htmlFor="guidance" className="block text-xs font-semibold text-gray-300 mb-2">
                        Guidance Scale ({guidance})
                      </label>
                      <input
                        id="guidance"
                        type="range"
                        min={guidanceRange.min}
                        max={guidanceRange.max}
                        value={guidance}
                        onChange={(event) => setGuidance(Number(event.target.value))}
                        className="w-full"
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        Höhere Werte folgen stärker dem Prompt, niedrigere lassen mehr vom Quellvideo übrig.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status: {status ? resolveStatusLabel(status) : 'Bereit'}</span>
                {status && status !== 'succeeded' && (
                  <span className="text-xs text-gray-500">{Math.round(progress * 100)}%</span>
                )}
              </div>

              {error && (
                <div className="bg-red-900/40 border border-red-500 text-red-200 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Generierung läuft…' : 'Video generieren'}
              </button>
            </form>

            {outputs.length > 0 && (
              <div className="mt-10 space-y-4">
                <h3 className="text-2xl font-bold text-white">Ergebnisse</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {outputs.map((outputUrl, index) => (
                    <div key={outputUrl ?? index} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                      <video
                        src={outputUrl}
                        controls
                        preload="metadata"
                        className="w-full h-64 object-cover"
                      />
                      <div className="px-4 py-3 border-t border-gray-800">
                        <span className="text-xs text-gray-500">Output {index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
