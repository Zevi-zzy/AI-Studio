
#!/bin/bash

# 检查是否安装了 Playwright
if ! npm list @playwright/test > /dev/null 2>&1; then
    echo "Installing Playwright..."
    npm install -D @playwright/test
    echo "Installing Playwright browsers..."
    npx playwright install chromium
else
    echo "Playwright already installed."
fi

# 运行测试
echo "Running E2E tests..."
npx playwright test
