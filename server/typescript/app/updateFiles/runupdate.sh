sudo -S apt update <./updateFiles/pwd && sudo apt upgrade -y <./updateFiles/pwd &&
sudo -S mv ./updateFiles/default /etc/nginx/sites-available <./updateFiles/pwd
sudo -S mv ./updateFiles/hlConfig.json /boot/firmware/ <./updateFiles/pwd
mv ./updateFiles/cert ./
rm ./updateFiles/pwd
rm ./updateFiles/runupdate.sh