**Image is based on Ubuntu 21.10 **

**How this works**
<blockquote>
Space Printer "API" is a backend whichs is written in TypeScript using NodeJs. This backend connects the UI with the firmware and communicates 
with the cadano blockchain in one of two way. Either through Cardano Box's hosted node or BLockfrost for those that don't wish to run their own node.

It utilizes https://open-rpc.org/ to generate and spec out the JSON-RPC 2.0 based back end api 
and front end client.

And uses Oura(https://github.com/txpipe/oura) to sync printer wallet data.
  
The idea of Space Printer dapp is to have it work directly with Raspberry Pi hardware that is connected to your 3D printers serial port.
Now days most serial ports on 3D printers are emulated through USB.
  
Also this takes in mind that you're running a 3D printer that suports Marlin flavored G Code commands which is something like 95% of all 3D printers.
However if you are running a specialty 3D printer and you ahve serial access to it, we will be more than happy to work with you to support as many 3D printers out of the box as we can.
  
Space Printer needs to be able to access the Cardano blockchain to pull information about print jobs from the Adosia market place smart contracts.
And to create transactions like minting your registration NFT and accepting print jobs etc etc.
  
The dapp/firmware is currently setup to use Blockfrost, from which you can get a free API key that gives you up to 50k requests a day which is MORE than enough for space printer. You will also be able to reuse the API key on more than one device.
  
Second solution is running Cardano Box From Adosia. Cardano Box runs Ogmios that is hooked up to the Cardano Node directly. If you have the know how on how to setup Ogmios and Cardano-node on your own hardware you can point Space Printer towards that as well.
  
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

<blockquote>
  **SSH Instructions**
  
  **SSH Credentials**
  username: printer
  password: spaceprinter
    
  Currently headless WiFi setup is not supported, this means you should use a Raspberry Pi tha thas an ethernet port for first setup.
  Once you burn the image on to a medium of your choice, first boot up will take longer. Due to expanding into the full size of your medium.
  And running some first time scripts. The first bootup time will also depend on the Raspberry Pi that you use.
  
  #1 I would recommend SSH into the device and changing the password with the `passwd` command.
  #2 setup your WiFi if you need to (instructions coming soon)
</blockquote>

<blockquote>
  **Using Space Printer**
  
  Keep in mind the Space Printer dapp is still in very early Development Beta stages.
  
  Once you have your Raspberry Pi running with the Space Printer firmware and connected to your network. You should be able to open up any web browser    and type in `spaceprinter` in the address box and it should bring up the Space Printer UI.

  From there you can select your session type, meaning how is the dapp accessing the Cardano Blockchain as explained above, you can chose `Blockfrost` or `Cardano Box`(Currently missing full implementation).

  Chosing the Blockfrost option will require you to create a local account on your device Manually and obtain a blockfrost API key.
  
  Chosing the Cardano Box option will only require you to login with the same account you have setup on your Cardano Box.
  
  If for some reason you're getting Auth Errors or no account on either solution and you can't remember your passwords. You can use the WIPE db solution, keep in mind this will also wipe any wallet information you had on the device. However you can easily recover your wallets wtih your seed phrase and all the data will resync from the Cardano Blockchain (FUCK YEAH DECENTRALIZATION)!!!
  
  Next step is to setup your printer wallet with one of two options, generate a new one or recover from seed phrase. Either option you chose you will need to have your Space Printer device connected to your printer via USB and make sure it has a serial connection.
  
  Once your wallet is setup you will need to make sure it's funded with enough ADA to complete registration transactions if it's a new wallet or to pick up new print jobs or complete current ones.
</blockquote>


