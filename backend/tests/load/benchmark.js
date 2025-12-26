const autocannon = require('autocannon');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Benchmark configurations
const benchmarks = [
  {
    name: 'Health Check',
    url: `${BACKEND_URL}/health`,
    method: 'GET',
    connections: 10,
    duration: 10
  },
  {
    name: 'Get Posts (Read Heavy)',
    url: `${BACKEND_URL}/api/posts`,
    method: 'GET',
    connections: 50,
    duration: 30
  },
  {
    name: 'Alumni Search',
    url: `${BACKEND_URL}/api/alumni/search?year=2020`,
    method: 'GET',
    connections: 50,
    duration: 30
  }
];

async function runBenchmark(config) {
  console.log(`\n🚀 Running benchmark: ${config.name}`);
  console.log('='.repeat(60));

  const result = await autocannon({
    url: config.url,
    connections: config.connections,
    duration: config.duration,
    method: config.method,
    headers: config.headers || {},
    body: config.body ? JSON.stringify(config.body) : undefined
  });

  return {
    name: config.name,
    requests: result.requests,
    throughput: result.throughput,
    latency: result.latency,
    errors: result.errors,
    timeouts: result.timeouts,
    non2xx: result.non2xx
  };
}

function displayResults(results) {
  console.log('\n📊 Benchmark Results Summary');
  console.log('='.repeat(80));
  console.log();

  // Simple table format
  console.log('┌─────────────────────────────┬────────────┬───────────────┬───────────────┬──────────────────┬────────┐');
  console.log('│ Test Name                   │ Req/sec    │ Latency (avg) │ Latency (p99) │ Throughput (MB/s)│ Errors │');
  console.log('├─────────────────────────────┼────────────┼───────────────┼───────────────┼──────────────────┼────────┤');
  
  results.forEach(result => {
    const name = result.name.padEnd(27);
    const reqSec = result.requests.average.toFixed(2).padStart(10);
    const latAvg = `${result.latency.mean.toFixed(2)}ms`.padStart(13);
    const latP99 = `${result.latency.p99.toFixed(2)}ms`.padStart(13);
    const throughput = (result.throughput.average / 1024 / 1024).toFixed(2).padStart(16);
    const errors = result.errors.toString().padStart(6);
    
    console.log(`│ ${name} │ ${reqSec} │ ${latAvg} │ ${latP99} │ ${throughput} │ ${errors} │`);
  });
  
  console.log('└─────────────────────────────┴────────────┴───────────────┴───────────────┴──────────────────┴────────┘');

  // Summary statistics
  const avgRequests = results.reduce((sum, r) => sum + r.requests.average, 0) / results.length;
  const avgLatency = results.reduce((sum, r) => sum + r.latency.mean, 0) / results.length;
  const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);

  console.log('\n📈 Overall Performance Metrics:');
  console.log(`   Average Requests/sec: ${avgRequests.toFixed(2)}`);
  console.log(`   Average Latency: ${avgLatency.toFixed(2)}ms`);
  console.log(`   Total Errors: ${totalErrors}`);

  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  if (avgLatency > 100) {
    console.log('   ⚠️  High latency detected. Consider:');
    console.log('      - Optimizing database queries');
    console.log('      - Adding caching (Redis)');
    console.log('      - Implementing CDN for static assets');
  }
  if (avgRequests < 100) {
    console.log('   ⚠️  Low throughput. Consider:');
    console.log('      - Increasing server resources');
    console.log('      - Using clustering/load balancing');
    console.log('      - Optimizing middleware');
  }
  if (totalErrors > 0) {
    console.log('   ❌ Errors detected. Review server logs and fix issues.');
  }
  if (avgLatency < 50 && avgRequests > 500 && totalErrors === 0) {
    console.log('   ✅ Excellent performance! Your backend is well-optimized.');
  }

  console.log('\n' + '='.repeat(80));
}

async function runAllBenchmarks() {
  console.log('🎯 NALUM Backend Performance Benchmark');
  console.log(`📍 Target: ${BACKEND_URL}`);
  console.log('⏰ Starting benchmarks...\n');

  const results = [];

  for (const benchmark of benchmarks) {
    try {
      const result = await runBenchmark(benchmark);
      results.push(result);
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Error running benchmark "${benchmark.name}":`, error.message);
    }
  }

  displayResults(results);

  // Save results to file
  const fs = require('fs');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `tests/load/results/benchmark-${timestamp}.json`;
  
  fs.mkdirSync('tests/load/results', { recursive: true });
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${filename}`);
}

// Run if executed directly
if (require.main === module) {
  runAllBenchmarks().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { runBenchmark, runAllBenchmarks };
