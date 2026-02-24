
import torch
import sys

def check_gpu():
    if torch.cuda.is_available():
        print(f"GPU Available: {torch.cuda.get_device_name(0)}")
        return True
    else:
        print("GPU NOT Available!")
        return False

def main():
    print("Running Sanity Check...")
    gpu = check_gpu()
    if not gpu:
        sys.exit(1)
    
    # Check imports
    try:
        import monai
        import fastapi
        print("Imports successful.")
    except ImportError as e:
        print(f"Import failed: {e}")
        sys.exit(1)
        
    print("Sanity Check Passed.")

if __name__ == "__main__":
    main()
