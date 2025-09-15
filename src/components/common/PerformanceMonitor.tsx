import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  memoryUsage?: number;
  loadTime: number;
  renderCount: number;
  lastRenderTime: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderCount: 0,
    lastRenderTime: 0
  });

  const renderStartTime = performance.now();

  useEffect(() => {
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime;

    setMetrics(prev => ({
      ...prev,
      renderCount: prev.renderCount + 1,
      lastRenderTime: renderTime,
      loadTime: prev.renderCount === 0 ? renderTime : prev.loadTime,
      memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 // MB
    }));

    // Log performance issues
    if (renderTime > 100) {
      console.warn(`⚠️ PERFORMANCE: ${componentName} slow render: ${renderTime.toFixed(2)}ms`);
    }

    if (prev => prev.renderCount > 50) {
      console.warn(`⚠️ PERFORMANCE: ${componentName} excessive re-renders: ${metrics.renderCount}`);
    }

  }, [componentName, renderStartTime]);

  return metrics;
};

// Development-only performance monitor
export const PerformanceMonitor: React.FC<{ 
  componentName: string;
  showMetrics?: boolean; 
}> = ({ componentName, showMetrics = false }) => {
  const metrics = usePerformanceMonitor(componentName);

  if (!showMetrics || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div className="font-semibold">{componentName}</div>
      <div>Load: {metrics.loadTime.toFixed(1)}ms</div>
      <div>Renders: {metrics.renderCount}</div>
      <div>Last: {metrics.lastRenderTime.toFixed(1)}ms</div>
      {metrics.memoryUsage && (
        <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
      )}
    </div>
  );
};

export default PerformanceMonitor;