#!/bin/bash
set -e
set -x

timestamp=$(date +"%F-%H%M")

# pull and run timetable-scraper-java
mkdir -p ~/ttbuild/ttbuild-${timestamp}/tsj
cd ~/ttbuild/ttbuild-${timestamp}/tsj
container_name="tsj-${timestamp}"
docker run -d -v $(pwd):/execution --name $container_name --pull=always ghcr.io/shrumit/timetable-scraper-java

container_running=$(docker inspect $container_name --format='{{.State.Running}}')
while [ "$container_running" = "true" ]; do
  echo "Sleeping 5m"
  sleep 5m
  container_running=$(docker inspect $container_name --format='{{.State.Running}}')
done

echo "Container exited."
container_exitcode=$(docker inspect $container_name --format='{{.State.ExitCode}}')
if (($container_exitcode != 0)); then
  echo "Container exitcode non-zero: ${container_exitcode}. Exiting."
  exit 1
fi

# clone and build Western-Timetable-maker using outputs from timetable-scraper-java
cd ..
git clone https://github.com/shrumit/Western-Timetable-Maker.git wtm
cp -a tsj/coutput*/* wtm/site/ttmaker/src/
cd wtm/site/ttmaker

npm ci
npm run build

# copy dist to /var/www
cp -r dist /var/www/
rm -rf /var/www/ttmaker.ca
mv /var/www/dist /var/www/ttmaker.ca

find /var/www/ -type d -exec chmod 755 {} \;
find /var/www/ -type f -exec chmod 644 {} \;

rm -rf /var/www/dist

docker container prune -f
docker volume prune -f
