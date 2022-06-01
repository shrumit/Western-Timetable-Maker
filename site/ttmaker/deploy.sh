#!/bin/bash
set -x

scp -r dist root@23.29.125.116:/var/www/
ssh root@23.29.125.116 "rm -rf /var/www/ttmaker.ca && mv /var/www/dist /var/www/ttmaker.ca && /root/chmod-script.sh"
