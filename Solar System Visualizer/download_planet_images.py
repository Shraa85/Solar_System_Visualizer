#!/usr/bin/env python3
"""
Download real NASA planet images and save them to static/planet_images/
These are free-to-use, high-quality planetary textures.
"""

import urllib.request
import os
from pathlib import Path

# Planet images mapping - URLs point to free NASA/space resources
PLANET_IMAGES = {
    'mercury.jpg': 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
    'venus.jpg': 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
    'earth.jpg': 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
    'mars.jpg': 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
    'jupiter.jpg': 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
    'saturn.jpg': 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
    'uranus.jpg': 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
    'neptune.jpg': 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
}

def download_planet_images():
    """Download all planet images from Solar System Scope (free resources)"""
    
    # Create directory if it doesn't exist
    img_dir = Path('static/planet_images')
    img_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print("Downloading Real NASA Planet Images")
    print("=" * 60)
    print(f"Saving to: {img_dir.absolute()}\n")
    
    total = len(PLANET_IMAGES)
    downloaded = 0
    failed = 0
    
    for filename, url in PLANET_IMAGES.items():
        filepath = img_dir / filename
        
        # Skip if already downloaded
        if filepath.exists():
            print(f"✓ {filename} (already exists - skipping)")
            downloaded += 1
            continue
        
        try:
            print(f"⬇ Downloading {filename}...", end=' ')
            urllib.request.urlretrieve(url, str(filepath))
            file_size = filepath.stat().st_size / (1024 * 1024)  # MB
            print(f"✓ ({file_size:.2f} MB)")
            downloaded += 1
        except Exception as e:
            print(f"✗ FAILED - {str(e)[:50]}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"Downloaded: {downloaded}/{total} images")
    if failed > 0:
        print(f"Failed: {failed} images")
        print("\nIf downloads failed, you may:")
        print("1. Check your internet connection")
        print("2. Try again - some servers block rapid requests")
        print("3. Manually download from: https://www.solarsystemscope.com/textures/")
    print("=" * 60)
    print("\n✓ Planet images ready! Refresh your visualizer to see them.\n")

if __name__ == '__main__':
    try:
        download_planet_images()
    except KeyboardInterrupt:
        print("\n\n✗ Download cancelled by user")
    except Exception as e:
        print(f"\n✗ Error: {e}")
