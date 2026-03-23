const { execSync } = require('node:child_process');

function run(command) {
  return execSync(command, { encoding: 'utf8' }).trim();
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function main() {
  try {
    const branch = run('git rev-parse --abbrev-ref HEAD');
    if (!['main', 'master'].includes(branch)) {
      fail(`发布失败：仅允许在 main/master 分支发布，当前分支为 ${branch}`);
    }

    const dirty = run('git status --porcelain');
    if (dirty) {
      fail('发布失败：当前工作区有未提交改动，请先提交后再执行 pnpm pub');
    }

    process.stdout.write(`发布检查通过，当前分支 ${branch}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    fail(`发布前检查失败：${message}`);
  }
}

main();
