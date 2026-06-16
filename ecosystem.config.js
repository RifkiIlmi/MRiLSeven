module.exports = {
  apps: [
    {
      name: "mrilseven",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max", // Menjalankan aplikasi dalam mode cluster untuk memanfaatkan seluruh core CPU
      exec_mode: "cluster", // Mengaktifkan load balancing antar instance
      watch: false, // Dinonaktifkan di production untuk menghindari restart tidak terduga
      max_memory_restart: "1G", // Me-restart aplikasi jika penggunaan memori melebihi 1GB (mencegah memory leak)
      env: {
        NODE_ENV: "production",
        PORT: 3000 // Port default Next.js
      },
      env_production: {
        NODE_ENV: "production"
      },
      autorestart: true, // Otomatis restart jika aplikasi crash
      merge_logs: true, // Menggabungkan log dari semua instance cluster
      time: true // Menambahkan timestamp pada log
    }
  ]
};


