# IMAGINE
Um site onde você não tem controle do que as cores podem criar
Uma demo interativa que simula tinta escorrendo e se acumulando em um quadro. O código usa canvas 2D, pool de partículas, offscreen canvas para splats suaves, pointer events e ajustes de alta resolução para telas HiDPI. Ideal para experimentos visuais, protótipos artísticos e estudos de física simples de partículas.

#Funcionalidades principais

- Gotas realistas com splats borrados e rastro curvo que imitam tinta úmida.

- Paleta variada com cores normais e cores especiais raras (dourado, prata, neon).

- Gravidade configurável com quatro direções e intensidade ajustável.

- Partículas fora do quadro continuam caindo verticalmente e são recicladas.

- Pool de partículas para evitar alocação excessiva e melhorar estabilidade.

- Controles UI para limpar, alternar gravidade, ajustar taxa, intensidade e limite de partículas.

- Respingos ao colidir para maior realismo.

# Instalação e execução

Clone ou baixe o repositório.

Coloque o arquivo index.html na pasta do projeto.

Abra index.html em um navegador moderno (Chrome, Edge, Firefox, Safari).

Não são necessárias dependências externas nem servidor; para desenvolvimento local com live reload, use sua ferramenta favorita (por exemplo, live-server).

Exemplo rápido

bash
# opcional: servir localmente com npm live-server
npx live-server .
# então abra http://127.0.0.1:8080

#Controles e uso

- Clique e arraste no canvas para derramar tinta.

- Limpar limpa a tela e recicla partículas.

- Gravidade alterna entre baixo, cima, esquerda e direita.

- Intensidade controla a aceleração aplicada às gotas.

- Taxa ajusta quantas partículas são geradas por movimento.

- Limite partículas evita sobrecarga em dispositivos fracos.

#Recomendações

- Em dispositivos móveis reduza Limite partículas e Taxa para manter fluidez.

- Aumente Intensidade para rastros mais longos e gotas mais rápidas.

#Personalização e extensões

- Viscosidade: ajuste trailLen e shadowBlur no código para rastro mais longo ou mais curto.

- Secagem: implemente decaimento de alpha ao longo do tempo para simular tinta secando.

- Exportar imagem: use canvas.toDataURL() para salvar o quadro final.

- WebGL: migre para WebGL para efeitos de mistura e blur em tempo real com melhor performance.

- Baldes e UI: adicione elementos interativos que derramem tinta automaticamente ao clicar.

#Performance e solução de problemas

- Diminuir spawnRate e MAX_PARTICLES se houver queda de FPS.

- Limitar DPR em dispositivos muito lentos para reduzir custo de desenho.

- Se o canvas parecer borrado, verifique devicePixelRatio e o redimensionamento correto do canvas.

- Em caso de vazamento de memória, verifique se partículas são recicladas no pool e se não há referências retidas.

Licença e créditos
Licença: MIT — sinta-se livre para usar, modificar e distribuir.

Créditos: implementação original por Hugo (usuário) com melhorias de protótipo e otimização.
