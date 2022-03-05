**Image is based on openSuse Tumbleweed**

**However setting it all up manually should work on any ARM64 based SBC**

**How this works**
<blockquote>
Currently Cardano Box API is written in TypeScript using NodeJs for the backend and React for the frontend. 

It utilizes https://open-rpc.org/ to generate and spec out the JSON-RPC 2.0 based back end api 
and front end client.

And uses Oura(https://github.com/txpipe/oura) to sync wallet data.
  
This project currently relies on running a full passive node(Correct my terminology here).
You can choose if you want to run a Mainnet or Testnet node, only one node can run at a time at this point.
  
</blockquote>

**Whats What**
<blockquote>
  
**Server directory** containes the backend source code the JSON-RPC 2.0<br/>
**Client directory** containes a reactjs client with auto compelte and everyting for the above api used in the UI.<br/>
</blockquote>

**Easiest method to run this is:**
<blockquote>
Download the Raspberry Pi4b image provided at this link, unzip it and burn it:

https://link.us1.storjshare.io/s/ju5agibgktop7jmkjfd5uj5g54qq/cardanobox/cardanobox_rpi4b.zip?download.
  
Using a SD card is not recommended because they're slow and yucky and just not fun at all. However I can not stop you from this self destructive endeavour, just warn you.
  
Now that you've been warned, to boot from USB you need to set your Raspberry Pi4b up to actually boot from USB, especially for this new version of Cardano Box and you will need an SD card for that, but don't worry it's pretty straight forward.

<blockquote>
  <strong>Setting up Rasberry Pi4b to boot from USB</strong>
  <br/>
  1)Download and install Raspberry Pi Imager from https://www.raspberrypi.org/software/.<br/>
  2)Insert a SD card (which will be erased)<br/>
  3)Start Raspberry Pi Imager<br/>
  4)Click on CHOOSE OS<br/>
  5)Click on Misc utility images<br/>
  7)Click on Bootloader<br/>
  8)Click on USB boot (it will still fallback to SD card if USB boot is not possible)<br/>
  9)Click on CHOOSE STORAGE and select your µSD card<br/>
  10)Click on WRITE and confirm with Yes
  
  Once the write is finished, you can plug the µSD card into your device and power it up, to flash the new firmware.

  Warning: Do not power off the device before the end of the firmware update!
  If you have a serial console, you can view the progress, otherwise just give it a minute or ten. If you drink beer at the same pace I do, finishing one beer means it finished flashing.
</blockquote>  

You can SSH into the device the **username** is: `box` **password** is: `cardanobox`

To access the web UI, plug your device to your network and open up your web browser(prefered chrome). 
Navigate to `http://cardanobox/`.

  
Currently, it is recommended to run the updater right after first login. If further instructions are needed they will be provided.
</blockquote>

WiFi instructions will be provided soon, if you know what you're doing just ssh into the beast and away you go :).

