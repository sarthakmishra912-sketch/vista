
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'figma:asset/f8cf341d9ca28100085225b1a0c814cc9d10a278.png': path.resolve(__dirname, './src/assets/f8cf341d9ca28100085225b1a0c814cc9d10a278.png'),
        'figma:asset/e22810488a2dea398cea28b8afe2e029a45b5b57.png': path.resolve(__dirname, './src/assets/e22810488a2dea398cea28b8afe2e029a45b5b57.png'),
        'figma:asset/dff479357ad6e8130c79c1839e0a1387559549d2.png': path.resolve(__dirname, './src/assets/dff479357ad6e8130c79c1839e0a1387559549d2.png'),
        'figma:asset/ccab72f0e9bf12b4ad08c152b84cbd87b9bb0945.png': path.resolve(__dirname, './src/assets/ccab72f0e9bf12b4ad08c152b84cbd87b9bb0945.png'),
        'figma:asset/c836a51cb14149522ea90e226a5303aca9ee4f23.png': path.resolve(__dirname, './src/assets/c836a51cb14149522ea90e226a5303aca9ee4f23.png'),
        'figma:asset/9093dd69bfc675875c96f91b73a7450d5b957fca.png': path.resolve(__dirname, './src/assets/9093dd69bfc675875c96f91b73a7450d5b957fca.png'),
        'figma:asset/89b4a4aaa1b03293257be5b42d742cca4fa15ee7.png': path.resolve(__dirname, './src/assets/89b4a4aaa1b03293257be5b42d742cca4fa15ee7.png'),
        'figma:asset/8112b71db0207e4b1e1760bdd8a8e5bd9b137d81.png': path.resolve(__dirname, './src/assets/8112b71db0207e4b1e1760bdd8a8e5bd9b137d81.png'),
        'figma:asset/807f21c1920af9e824c25cc65cc5f797e9946d35.png': path.resolve(__dirname, './src/assets/807f21c1920af9e824c25cc65cc5f797e9946d35.png'),
        'figma:asset/7f47ed867f69a74c7c3460960b62538febb7f450.png': path.resolve(__dirname, './src/assets/7f47ed867f69a74c7c3460960b62538febb7f450.png'),
        'figma:asset/71252cca4c888d88500481199a8e5e20a4996b73.png': path.resolve(__dirname, './src/assets/71252cca4c888d88500481199a8e5e20a4996b73.png'),
        'figma:asset/5d54f3b2ac26f683d46d31996748c6b7893e6cc5.png': path.resolve(__dirname, './src/assets/5d54f3b2ac26f683d46d31996748c6b7893e6cc5.png'),
        'figma:asset/516e77515feb8b0da14eb9d08100d04603ad8beb.png': path.resolve(__dirname, './src/assets/516e77515feb8b0da14eb9d08100d04603ad8beb.png'),
        'figma:asset/4e95da5f9e6ec1d32f897fbff5c28b62b3c1d8ed.png': path.resolve(__dirname, './src/assets/4e95da5f9e6ec1d32f897fbff5c28b62b3c1d8ed.png'),
        'figma:asset/476ff6f1a6a1f52a02c7ac15d243763b00d931ee.png': path.resolve(__dirname, './src/assets/476ff6f1a6a1f52a02c7ac15d243763b00d931ee.png'),
        'figma:asset/3485215e53b4916c63f0e92a24e27c925b4a7d9e.png': path.resolve(__dirname, './src/assets/3485215e53b4916c63f0e92a24e27c925b4a7d9e.png'),
        'figma:asset/176ba6c12ab7f022834992fb78872f1e9feeb9a4.png': path.resolve(__dirname, './src/assets/176ba6c12ab7f022834992fb78872f1e9feeb9a4.png'),
        'figma:asset/0c4e8a4be75e7d129875490702ea90e0ae00c34d.png': path.resolve(__dirname, './src/assets/0c4e8a4be75e7d129875490702ea90e0ae00c34d.png'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });