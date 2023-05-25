import { spawn } from 'child_process';
import { createServer, build } from 'vite';
import electron from 'electron';

const argvs = {};
process.argv.slice(2).map((item) => {
  const [name, val] = item.split('=');
  argvs[name.replace(/^--/, '')] = val;
});

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchMain(server) {
  /**
   * @type {import('child_process').ChildProcessWithoutNullStreams | null}
   */
  let electronProcess = null;
  const address = server.httpServer.address();
  const env = Object.assign(process.env, {
    VITE_DEV_SERVER_HOST: address.address,
    VITE_DEV_SERVER_PORT: address.port
  });

  return build({
    configFile: 'packages/main/vite.config.ts',
    mode: 'development',
    plugins: [
      // 在VSCODE调试下不需要在这里启动
      !process.env.VSCODE_DEBUG
        ? {
            name: 'electron-primary-watcher',
            writeBundle() {
              if (electronProcess) {
                electronProcess.removeAllListeners();
                electronProcess.kill();
              }
              electronProcess = spawn(electron, ['.'], {
                stdio: 'inherit',
                env
              });
              electronProcess.once('exit', process.exit);
            }
          }
        : {}
    ],
    build: {
      watch: {}
    }
  });
}

/**
 * @type {(server: import('vite').ViteDevServer) => Promise<import('rollup').RollupWatcher>}
 */
function watchPreload(server) {
  return build({
    configFile: 'packages/preload/vite.config.ts',
    mode: 'development',
    plugins: [
      {
        name: 'electron-preload-watcher',
        writeBundle() {
          server.ws.send({ type: 'full-reload' });
        }
      }
    ],
    build: {
      watch: {}
    }
  });
}

// bootstrap
const server = await createServer({
  configFile: 'packages/renderer/vite.config.ts'
});

await server.listen();
await watchPreload(server);
await watchMain(server);
