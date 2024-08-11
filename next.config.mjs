/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/courses/:courseId/materials/:materialId",
        destination: "/api/courses/[courseId]/materials/[materialId]",
      },
    ];
  },
};

export default nextConfig;
