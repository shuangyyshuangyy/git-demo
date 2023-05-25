import { build } from 'vite';
import chalk from 'chalk';
const argvs = {};
process.argv.slice(2).map((item) => {
  const [name, val] = item.split('=');
  argvs[name.replace(/^--/, '')] = val;
});
const target = argvs.target;

const buildRenderer = async () => {
  await build({ configFile: 'packages/renderer/vite.config.ts' });
  console.log('');
};
// const buildLoading = async () => {
//   await build({ configFile: 'packages/loading/vite.config.ts' });
//   console.log('');
// };

const buildElectron = async () => {
  await build({
    configFile: 'packages/main/vite.config.ts'
  });
  await build({ configFile: 'packages/preload/vite.config.ts' });
  console.log('');
};

if (target == 'renderer') {
  await buildRenderer();
} else if (target == 'loading') {
  // await buildLoading();
} else if (target == 'electron') {
  await buildElectron();
  // await buildLoading();
} else {
  await buildElectron();
  // await buildLoading();
  await buildRenderer();
}
