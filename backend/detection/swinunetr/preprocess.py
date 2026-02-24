from monai.transforms import (
    Compose, LoadImaged, EnsureChannelFirstd,
    Orientationd, Spacingd, ResizeWithPadOrCropd,
    ScaleIntensityRanged, EnsureTyped
)

def get_ct_transforms():
    return Compose([
        LoadImaged(keys=["image"]),
        EnsureChannelFirstd(keys=["image"]),
        Orientationd(keys=["image"], axcodes="RAS"),
        Spacingd(
            keys=["image"],
            pixdim=(1.5, 1.5, 1.5),
            mode=("bilinear")
        ),
        ResizeWithPadOrCropd(
            keys=["image"],
            spatial_size=(128, 128, 128)  # 🔥 GPU-safe
        ),
        ScaleIntensityRanged(
            keys=["image"],
            a_min=-1000,
            a_max=400,
            b_min=0.0,
            b_max=1.0,
            clip=True
        ),
        EnsureTyped(keys=["image"])
    ])
