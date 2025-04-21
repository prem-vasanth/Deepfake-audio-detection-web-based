import librosa
import numpy as np
import matplotlib.pyplot as plt
import librosa.display
import io
import base64

def analyze_mel_spectrogram_from_array(y, sr):
    result = {}

    

    # === 1. Mel Spectrogram ===
    mel_spectrogram = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=1024, hop_length=512, n_mels=128, fmax=8000)
    mel_db = librosa.power_to_db(mel_spectrogram, ref=np.max)

    # === 2. Plot Mel Spectrogram and encode ===
    fig, ax = plt.subplots(figsize=(10, 4))
    img = librosa.display.specshow(mel_db, x_axis='time', y_axis='mel', sr=sr, hop_length=512, fmax=8000, cmap='inferno')
    plt.colorbar(img, ax=ax, format='%+2.0f dB')
    plt.title('Mel Spectrogram (dB)')
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)

    result["spectrogram_image_base64"] = image_base64

    # === 3. Energy Analysis ===
    total_energy = np.sum(mel_spectrogram)
    low_band_energy = np.sum(mel_spectrogram[:20, :])
    high_band_energy = np.sum(mel_spectrogram[-20:, :])

    low_ratio = low_band_energy / total_energy
    high_ratio = high_band_energy / total_energy

    # === 4. Spectral Flatness ===
    flatness = librosa.feature.spectral_flatness(y=y)[0]
    avg_flatness = float(np.mean(flatness))

    result["duration_sec"] = round(len(y) / sr, 2)
    result["low_freq_energy_ratio"] = round(float(low_ratio), 3)
    result["high_freq_energy_ratio"] = round(float(high_ratio), 3)
    result["spectral_flatness"] = round(avg_flatness, 3)

    # === 5. Observations ===
    deepfake_flags = []
    natural_flags = []

    if avg_flatness > 0.4:
        deepfake_flags.append("High flatness (may indicate robotic/synthetic audio).")
    if high_ratio < 0.05:
        deepfake_flags.append("Weak high-mel-band energy (could suggest deepfake traits).")
    if low_ratio > 0.8:
        deepfake_flags.append("Overwhelming low-frequency energy (abnormal).")

    if avg_flatness < 0.4:
        natural_flags.append("Spectral flatness is low (indicating structured voice, typical of natural speech).")
    if high_ratio > 0.05:
        natural_flags.append("High-mel-band energy (typical of real voices with clear sibilants and formants).")
    if low_ratio < 0.8:
        natural_flags.append("Balanced low-frequency energy (not overwhelming, typical of natural speech).")

    result["deepfake_indicators"] = deepfake_flags
    result["natural_indicators"] = natural_flags

    if deepfake_flags:
        result["verdict"] = "⚠️ Possible Deepfake Traits Detected"
    else:
        result["verdict"] = "✅ No Deepfake Indicators Detected"

    return result
