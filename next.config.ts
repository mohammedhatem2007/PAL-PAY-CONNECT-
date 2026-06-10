import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // ضروري جداً لتحويل المشروع لملفات ثابتة للجوال
  images: {
    unoptimized: true, // ضروري إذا كنت تستخدم مكون <Image /> من نكست
  },
  // أي إعدادات أخرى لديك اتركها كما هي
};

export default nextConfig;
