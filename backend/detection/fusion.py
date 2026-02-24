import numpy as np

def fuse_results(
    classification_prob: float,
    segmentation_map: np.ndarray,
    cls_threshold: float = 0.7,
    seg_threshold: float = 0.3
):
    """
    classification_prob: DenseNet abnormal probability (0–1)
    segmentation_map: SwinUNETR output (H×W×D)
    """

    seg_score = np.mean(segmentation_map)

    decision = {
        "classification_confidence": float(classification_prob),
        "segmentation_score": float(seg_score),
        "anomaly": False,
        "severity": "none"
    }

    if classification_prob > cls_threshold and seg_score > seg_threshold:
        decision["anomaly"] = True

        if seg_score > 0.6:
            decision["severity"] = "high"
        elif seg_score > 0.4:
            decision["severity"] = "medium"
        else:
            decision["severity"] = "low"

    return decision
