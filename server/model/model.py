import torch
import numpy as np
from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2ForSequenceClassification
import torch.nn.functional as F

# Load model and feature extractor once
model_path = "./final-wav2vec2-model"  # update if your Flask app runs elsewhere
model = Wav2Vec2ForSequenceClassification.from_pretrained(model_path)
feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(model_path)
model.eval()

def classify_audio(waveform_np):
    """
    waveform_np: 1D NumPy array (from librosa.load())
    """
    # Normalize if necessary
    if np.max(np.abs(waveform_np)) > 0:
        waveform_np = waveform_np / np.max(np.abs(waveform_np))

    inputs = feature_extractor(
        waveform_np,
        sampling_rate=16000,
        return_tensors="pt",
        padding=True
    )

    with torch.no_grad():
        logits = model(**inputs).logits
        probs = F.softmax(logits, dim=-1)  # [batch_size, num_classes]
        print("Logits:", logits)
        print("Softmax probabilities:", probs)


        predicted_class_id = torch.argmax(probs, dim=-1)[0].item()
        confidence_score = probs[0][predicted_class_id].item()
        label = model.config.id2label[predicted_class_id]

    return {"confidence":confidence_score , "label":label}
