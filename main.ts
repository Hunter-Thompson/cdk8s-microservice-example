import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { MyRedis } from '@opencdk8s/cdk8s-redis-sts';
import { Deployment } from 'cdk8s-plus-17';
export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);
const redis = new MyRedis(this, 'redis', {
      image: 'redis',
      namespace: 'default',
      volumeSize: '10Gi',
      replicas: 3,
      createStorageClass: false,
    });
new Deployment(this, "deployment", {
      metadata: {
        namespace: 'default',
      },
      containers: [{
        image: "hunterthompson/node-redis-counter:latest",
        name: "hello",
        env: {
          'REDIS_URI': {
            value: redis.name
          }
        }
      }]
    })
  }
}
const app = new App();
new MyChart(app, 'microservice');
app.synth();
