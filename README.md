# _Latent-Playground_
- A Max for Live device based on **mcs.nn~** for real-time latent interaction in Ableton.

<img src="/assets/Core.png" width="300">  

- Manipulate latent variables by creating repetitive trajectories with seed based noises like perlin, voronoi, fractal or simplex.

<img src="/assets/Manipulation.png">

- Map latent controls to a 2D space with _fluid.mlpregressor~_, a multi-layer perceptron, to create some order out of chaos.

<img src="/assets/Control.png" width="360">

- Recover weights of the neural network and bend them by drawing or generating classical distributions that share the same statistics.

<img src="/assets/Bending.png" width="600">

- All parameters can be automated and stored. 

<img src="/assets/Automations.png" width="460">


## _Installation_

1. Download source code and _mcs.nn~_ from latest release
2. Unzip all and move _mcs.nn~_ to externals in _Latent-Playground_ main folder
3. Add externals to your Max Filepath
4. Open _fluid.lib.manipulation.mxo_ in Max 
5. Add the _.amxd_ device to your track


## _Important_ 
- fluid.dataset~ and fluid.mlpregressor~ are wrapped into fluid.lib.manipulation.mxo so you need to open it with Max before using the device (just double-click on it in the Finder) or it won't load properly. 
- The mcs.nn~ object used in this project is a modified one, so use the one provided or it will crash. Be careful to momentarily disable access to the official mcs.nn~ object if you're using it already. 
- It has been compiled for Mac, you'll need to get the source code if you want to use it with Windows. You can access it here : [mcs.nn_tilde_bending](https://github.com/LucasBrgt/mcs.nn_tilde_bending_MaxMSP).


## _Prerequisites_
- Ableton Live Suite >= 12.1.1 and MaxMSP >= 9.0.2, it should work with Live 11 and Max 8 but it has not been tested so be sure to look at the Max Console if doing so.

## _Known issue_
- If you edit the device in max and load a model while editing, you should know that Ableton will crash if you attempt to destroy the device in Ableton while Max is opened. This is certainly due to a conflict with detached threads but I never found the solution. Workaround => closing Max before destroying the device is a good practice. 

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
