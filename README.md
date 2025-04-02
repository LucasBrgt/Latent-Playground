# Latent-Playground
- A Max for Live device based on **mcs.nn~** for real-time latent interaction in Ableton.

![png#1](/assets/Core.png)  

- Use it to manipulate latent variables by create repetitive trajectories with seed based noises like perlin, voronoi, fractal or simplex.

![png#2](/assets/Manipulation.png) 

- Recover weights of the neural network and bend it by drawing or generating classical distributions that share the same statistics.

![png#3](/assets/Bending.png)  


## Important 
- Be sure to add the path to _externals_ folder to your Max File Prefernces.
- fluid.dataset~ and fluid.mlpregressor~ are wrapped into fluid.lib.manipulation.mxo so you need to open this last with Max by double-click or it won't load properly. 
- The mcs.nn~ object used in this project is a modified one, so use the one provided. 
- It has been compiled for ARM based Mac, you'll need to get the source code if you want to use it with Intel ARM Mac or Windows. You can access it here : [mcs.nn_tilde_bending](https://github.com/LucasBrgt/mcs.nn_tilde_bending_MaxMSP)


## Prerequisites
- Ableton Live Suite >= 12.1.1 and MaxMSP >= 9.0.2, it should work with Live 11 and Max 8 but the test has not been done so be sure to look at the Max Console if doing so.
&nbsp;  
&nbsp;
&nbsp;  
&nbsp;
---

Shield: [![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg
