**Image is based on Ubuntu 21.10 **

**How this works**
<blockquote>
Spaceprinter API is written in TypeScript using NodeJs for the backend and React for the frontend. 

It utilizes https://open-rpc.org/ to generate and spec out the JSON-RPC 2.0 based back end api 
and front end client.

And uses Oura(https://github.com/txpipe/oura) to sync printer wallet data.
</blockquote>

**Whats What**
<blockquote>
**Server directory** containes the backend api source code the JSON-RPC 2.0<br/>
**Client directory** containes a reactjs client with auto compelte and everyting for the above api.<br/>
</blockquote>

**Using the image**
<blockquote>

[spaceprinter_rpi-beta-v.01.img](https://link.us1.storjshare.io/s/jvnlbmbbkbduopvn2lxt2ylmghra/spaceprinter/spaceprinter_rpi-beta-v.01.img?download=1)
  
Currently space printer is supported on all Raspberry PI3 and above. You can atually burn the image onto a SD Card or USB Drive and switch it on the go between different Raspberry Pis.

Few things to keep in mind. Using certain Raspberry Pi's come with certian restrictions outlined below:
  
**SD Cards**: Even though this image is supported on SD Cards and using certain Raspberry Pi models will give you no choice but to use a SD Card. I am not a SD Card fan, they're not too reliable and painfully slow but get the job done more than most of the time. However as long as youn save your printer seed phrases do to decentralization and data being stored on the Cardano network recovering from a crashed SD card or system in general is rather painless.
  
**Slicer**: SpacePrinter has capability to run Kiri:Moto Slicer locally, but it won't let you set it up unless you're using a device with 4Gb or more.
  
**Raspberry Pi 3A+**: This is a great little 512Ram Quad Corce devvice wtih build in WiFi, SD Card port and 1xUSB2.0 port. Using this device you will need to setup a file with your WiFi credentials describe int he instructions and you can only use an SD card do to it only hacing one USB port which use going to be use to plug into your 3D printer.
  
**Raspberry Pi 3B+**: This is by far my favorite model and I still have one I bought 5 years ago. These come with 1Gb Ram, Quad 64Bit core, 4 USB ports and ethernet port. Due to the fact that you can plug this one up to your network directly it makes it somewhat easier to do first time setup after burning and running your image.

**Raspberry Pi 4B+** Much like the 3B+ any range from 1Gb to 8Gb of these will work these are excellent SBCs.
</blockquote>





