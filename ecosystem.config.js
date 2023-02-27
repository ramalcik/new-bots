let _sys = require('./_SYSTEM/GlobalSystem/server.json');

let cârtel = [
  {
    name: "Jollity",
    namespace: "cârteL#4000",
    script: 'cartel.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./_BOTLAR/Jollity"
  },
  {
    name: "Intanfry",
    namespace: "cârteL#4000",
    script: 'cartel.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./_BOTLAR/Intanfry"
  },
  {
    name: "Statistics",
    namespace: "cârteL#4000",
    script: 'cartel.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./_BOTLAR/Statistics"
  },
  {
    name: "Orion",
    namespace: "cârteL#4000",
    script: 'cartel.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./_BOTLAR/Orion"
  },
  {
    name: "FIREWALL_I",
    namespace: "cârteL#4000",
    script: 'cartel.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./_BOTLAR/FIREWALL_ONE"
  },
  {
    name: "FIREWALL_II",
    namespace: "cârteL#4000",
    script: 'cartel.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./_BOTLAR/FIREWALL_TWO"
  },
  {
    name: "FIREWALL_III",
    namespace: "cârteL#4000",
    script: 'cartel.js',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./_BOTLAR/FIREWALL_THREE"
  },
{
  name: "FIREWALL_IV",
  namespace: "cârteL#4000",
  script: 'cartel.js',
  watch: false,
  exec_mode: "cluster",
  max_memory_restart: "2G",
  cwd: "./_BOTLAR/FIREWALL_FOUR"
},
  {
    name: "FIREWALL_DİSTRİBUTORS",
    namespace: "cârteL#4000",
    script: 'cartel',
    watch: false,
    exec_mode: "cluster",
    max_memory_restart: "2G",
    cwd: "./_BOTLAR/FIREWALL_DİSTRİBUTORS"
  },
]
if(_sys.TOKENLER.WELCOME.Active) {
  cârtel.push(
    {
      name: "Voices",
      namespace: "cârteL#4000",
      script: 'Start.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "../WELCOMES"
    }
  )
}
module.exports = {
  apps: cârtel
};