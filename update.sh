#!/bin/bash
# 快速更新脚本 - 一键推送到 GitHub
# 使用方法：./update.sh "更新说明"

COMMIT_MSG=${1:-"Update blog content"}

echo "🚀 开始更新博客..."
echo "📝 提交信息: $COMMIT_MSG"

# 检查是否有未提交的更改
if [ -z "$(git status --porcelain)" ]; then
    echo "⚠️  没有需要提交的更改"
    exit 0
fi

# 添加所有更改
git add .

# 提交
git commit -m "$COMMIT_MSG"

# 推送到 GitHub
echo "📤 推送到 GitHub..."
git push origin main

echo "✅ 完成！"
echo "🌐 Vercel 会自动检测到更新并部署"
echo "📊 查看部署状态: https://vercel.com"

