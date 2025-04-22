echo "Switching to branch main"
git checkout main

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* administrator@192.168.10.11:/var/www/tripticket-app/
# scp -r build/* junebence@172.16.0.21:/var/www/feedback-app/

echo "DONE!"