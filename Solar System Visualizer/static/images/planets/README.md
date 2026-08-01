# Planet Textures

Add planet texture images to this folder to display realistic planet surfaces in the visualizer.

## How to Add Planet Images

1. Place your planet images in this folder (`static/images/planets/`)
2. Use the following filenames (case-sensitive):
   - `mercury.jpg`
   - `venus.jpg`
   - `earth.jpg`
   - `mars.jpg`
   - `jupiter.jpg`
   - `saturn.jpg`
   - `uranus.jpg`
   - `neptune.jpg`

3. Recommended image specs:
   - Format: JPG or PNG
   - Size: 1024x1024 or 2048x2048 pixels (larger = more detail)
   - Type: Spherical map/equirectangular projection for best results

## Free Planet Texture Sources

Here are free resources where you can find realistic planet textures:

### NASA Resources
- **NASA SPICE Toolkit**: https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/
- **NASA Images**: https://images.nasa.gov/
- **Solar System Exploration**: https://solarsystem.nasa.gov/

### Awesome Space Textures
- **OpenGL Planet Textures**: http://www.learnopengl.com/ (Planet tutorial with textures)
- **Solar System Scope**: https://www.solarsystemscope.com/textures/
- **Celestia Textures**: https://celestia.space/

### High Quality Free Textures
- **Poly Haven**: https://polyhaven.com/ (Free 3D assets)
- **Sketchfab**: https://sketchfab.com/ (Browse with "Creative Commons" license filter)
- **Textures by Google**: https://www.google.com/search?q=planet+texture+free+license

## How to Use Images

Once you've added images to this folder:
1. The visualizer will automatically detect them on the next page load
2. Planets with matching texture files will display the textures
3. Planets without textures will fall back to solid colors
4. No code changes needed - it works automatically!

## Example: Getting Earth Texture

1. Visit one of the sources above (e.g., Solar System Scope)
2. Download an Earth texture image
3. Save it as `earth.jpg` in this folder
4. Refresh your visualizer - Earth will now show the texture!

## Troubleshooting

**Texture not showing?**
- Check filename matches exactly (case-sensitive)
- Ensure file is in `.jpg` or `.png` format
- Check browser console (F12 → Console) for error messages
- Make sure the file is in `static/images/planets/` folder

**Performance issues with large textures?**
- Reduce image size to 1024x1024 pixels
- Convert to JPG for smaller file size
- Check that file size is under 2MB per image
