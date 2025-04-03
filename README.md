# _Latent-Playground_
- A Max for Live device based on **mcs.nn~** for real-time latent interaction in Ableton.

<img src="/assets/Core.png" width="300">  

- Manipulate latent variables by creating repetitive trajectories with seed based noises like perlin, voronoi, fractal or simplex.

<img src="/assets/Manipulation.png">

- Map latent controls to a 2D space with _fluid.mlpregressor~_, a multi-layer perceptron, to create some order out of chaos.

<img src="/assets/Control.png">

- Recover weights of the neural network and bend it by drawing or generating classical distributions that share the same statistics.

<img src="/assets/Bending.png">


## _Important_ 
- Be sure to add the path to _externals_ folder to your Max File Preferences.
- fluid.dataset~ and fluid.mlpregressor~ are wrapped into fluid.lib.manipulation.mxo so you need to open it with Max by double-click or it won't load properly. 
- The mcs.nn~ object used in this project is a modified one, so use the one provided. 
- It has been compiled for ARM based Mac, you'll need to get the source code if you want to use it with Intel based Mac or Windows. You can access it here : [mcs.nn_tilde_bending](https://github.com/LucasBrgt/mcs.nn_tilde_bending_MaxMSP)


## _Prerequisites_
- Ableton Live Suite >= 12.1.1 and MaxMSP >= 9.0.2, it should work with Live 11 and Max 8 but it has not been tested so be sure to look at the Max Console if doing so.
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
