const { execSync, spawn } = require('child_process');
const os = require('os');

// Descobre o IP local da máquina na rede Wi-Fi/Cabo
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        // Retorna o primeiro IP válido encontrado na rede
        return alias.address;
      }
    }
  }
  return 'localhost';
}

const ip = getLocalIp();
const url = `http://${ip}:5173`;

console.log('==========================================');
console.log('       INICIANDO O SISTEMA DE BINGO       ');
console.log('==========================================');
console.log(`\nIP da sua maquina detectado: ${ip}`);
console.log(`Abrindo o navegador em: ${url}\n`);

// Abre o navegador com o IP da rede (para o QR Code funcionar)
const startCmd = process.platform === 'win32' ? 'start' : (process.platform === 'darwin' ? 'open' : 'xdg-open');
try {
  execSync(`${startCmd} ${url}`);
} catch (e) {
  console.log('Nao foi possivel abrir o navegador automaticamente. Por favor, acesse o link acima manualmente.');
}

// Inicia o servidor Vite na pasta frontend e libera acesso na rede (--host)
console.log('Iniciando servidor...');
const vite = spawn('npm', ['run', 'dev', '--', '--host'], { 
  cwd: './frontend', 
  stdio: 'inherit', 
  shell: true 
});
