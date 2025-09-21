# Nginx Deployment Guide

This guide will walk you through configuring Nginx to serve your application.

## 1. Install Nginx

First, you need to install Nginx on your server. The installation process varies depending on your operating system.

*   **Ubuntu/Debian:**
    ```bash
    sudo apt update
    sudo apt install nginx
    ```

*   **CentOS/RHEL:**
    ```bash
    sudo yum install epel-release
    sudo yum install nginx
    ```

*   **Windows:**
    You can download the latest stable version from the [Nginx website](http://nginx.org/en/download.html). Follow the instructions in the included `README` file.

## 2. Locate the Nginx Configuration File

The location of the main Nginx configuration file can vary. Common locations are:

*   `/etc/nginx/nginx.conf`
*   `/etc/nginx/sites-available/default`
*   `/usr/local/nginx/conf/nginx.conf`

## 3. Edit the Configuration File

Open the Nginx configuration file in a text editor. You will need to replace the default `server` block with the one provided in `nginx.conf`.

**Important:**
*   Replace `your_domain.com` with your actual domain name.
*   Replace `/path/to/your/frontend/dist` with the **absolute path** to the `dist` directory of your frontend build. You can get the absolute path by running `pwd` (on Linux/macOS) or `cd` (on Windows) in the `dist` directory.

Here is the configuration template:

```nginx
server {
    listen 80;
    server_name your_domain.com;

    root /path/to/your/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/v1 {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 4. Test and Reload Nginx

After editing the configuration, you need to test it for syntax errors and then reload Nginx for the changes to take effect.

*   **Test the configuration:**
    ```bash
    sudo nginx -t
    ```
    If the test is successful, you will see a message like:
    ```
    nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
    nginx: configuration file /etc/nginx/nginx.conf test is successful
    ```

*   **Reload Nginx:**
    ```bash
    sudo systemctl reload nginx
    ```
    Or, if you are not using `systemd`:
    ```bash
    sudo service nginx reload
    ```

## 5. Set up SSL (Recommended)

For a production site, you should use HTTPS to secure your application. You can get a free SSL certificate from [Let's Encrypt](https://letsencrypt.org/).

The process involves:
1.  Installing the Certbot client.
2.  Running Certbot to obtain and install the certificate.
3.  Certbot will automatically update your Nginx configuration to use the new certificate and set up automatic renewal.

Please refer to the [Certbot website](https://certbot.eff.org/) for detailed instructions for your specific operating system and web server.
