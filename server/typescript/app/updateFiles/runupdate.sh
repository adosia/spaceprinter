sudo -S mv ./updateFiles/default /etc/nginx/sites-available <./updateFiles/pwd &&
sudo -S mv ./updateFiles/hlConfig.json /boot/firmware/ <./updateFiles/pwd &&
sudo -S mv ./updateFiles/cert $(pwd) <./updateFiles/pwd &&
sudo -S systemctl restart nginx <./updateFiles/pwd &&
rm ./updateFiles/pwd &&
rm ./updateFiles/runupdate.sh