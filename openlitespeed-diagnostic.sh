#!/bin/bash

echo "🔍 OpenLiteSpeed Diagnostic Script"
echo "=================================="
echo ""

# Check if OpenLiteSpeed is installed
echo "📦 Checking OpenLiteSpeed Installation:"
if [ -d "/usr/local/lsws" ]; then
    echo "✅ OpenLiteSpeed directory found: /usr/local/lsws"
    ls -la /usr/local/lsws/
else
    echo "❌ OpenLiteSpeed not found in /usr/local/lsws"
    echo "   Checking alternative locations..."
    find / -name "*litespeed*" -type d 2>/dev/null | head -10
fi

echo ""
echo "🔧 Checking OpenLiteSpeed Service:"
if systemctl is-active --quiet lsws; then
    echo "✅ OpenLiteSpeed service is running"
    systemctl status lsws --no-pager
else
    echo "❌ OpenLiteSpeed service is not running"
    echo "   Attempting to start..."
    systemctl start lsws
    sleep 3
    if systemctl is-active --quiet lsws; then
        echo "✅ OpenLiteSpeed started successfully"
    else
        echo "❌ Failed to start OpenLiteSpeed"
        echo "   Check logs:"
        journalctl -u lsws --no-pager -n 20
    fi
fi

echo ""
echo "🌐 Checking Network Ports:"
echo "Port 7080 (WebAdmin):"
if netstat -tlnp | grep -q ":7080"; then
    echo "✅ Port 7080 is listening"
    netstat -tlnp | grep ":7080"
else
    echo "❌ Port 7080 is not listening"
fi

echo ""
echo "Port 8088 (Default HTTP):"
if netstat -tlnp | grep -q ":8088"; then
    echo "✅ Port 8088 is listening"
    netstat -tlnp | grep ":8088"
else
    echo "❌ Port 8088 is not listening"
fi

echo ""
echo "🔥 Checking Firewall:"
if command -v ufw &> /dev/null; then
    echo "UFW Status:"
    ufw status | grep -E "(7080|8088|80|443)"
else
    echo "UFW not installed, checking iptables..."
    iptables -L INPUT | grep -E "(7080|8088|80|443)" || echo "No specific rules found"
fi

echo ""
echo "📋 Checking OpenLiteSpeed Configuration:"
if [ -f "/usr/local/lsws/conf/httpd_config.conf" ]; then
    echo "✅ Main config found"
    grep -E "(adminPort|adminIPs)" /usr/local/lsws/conf/httpd_config.conf || echo "Default admin settings"
else
    echo "❌ Main config not found"
fi

if [ -f "/usr/local/lsws/admin/conf/admin_config.conf" ]; then
    echo "✅ Admin config found"
    grep -E "(port|adminIPs)" /usr/local/lsws/admin/conf/admin_config.conf || echo "Default admin settings"
else
    echo "❌ Admin config not found"
fi

echo ""
echo "📊 System Information:"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "Hostname: $(hostname)"
echo "IP Address: $(hostname -I | awk '{print $1}')"
echo "Memory: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $3"/"$2" ("$5" used)"}')"

echo ""
echo "🔗 Access URLs to try:"
echo "1. https://148.230.101.50:7080"
echo "2. http://148.230.101.50:7080"
echo "3. https://$(hostname -I | awk '{print $1}'):7080"
echo "4. http://$(hostname -I | awk '{print $1}'):7080"

echo ""
echo "📝 Recommended Actions:"
if ! systemctl is-active --quiet lsws; then
    echo "❗ Start OpenLiteSpeed: sudo systemctl start lsws"
fi

if ! netstat -tlnp | grep -q ":7080"; then
    echo "❗ Check admin port configuration"
    echo "❗ Reset admin password: sudo /usr/local/lsws/admin/misc/admpass.sh"
fi

echo "❗ Check Hostinger control panel for OpenLiteSpeed management"
echo "❗ Ensure your local firewall/antivirus allows port 7080"

echo ""
echo "Diagnostic complete! ✅"