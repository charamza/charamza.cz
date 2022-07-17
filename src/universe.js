const {create, identity, rotate, translate, perspective} = require('./matrix');

const canvas = document.getElementById("canvas-game");
const gl = canvas.getContext('webgl');

class Shader {

  constructor() {
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, `
      attribute vec3 a_coords;

      uniform mat4 u_view;
      uniform mat4 u_projection;

      void main(void) {
       gl_Position = u_projection * u_view * vec4(a_coords, 1.0);
       gl_PointSize = 3.0;
      }
    `);
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, `
       precision lowp float;

       void main(void) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
       }
    `);
    gl.compileShader(fragShader);

    this.program = gl.createProgram();
    gl.attachShader(this.program, vertShader);
    gl.attachShader(this.program, fragShader);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);
  }

  bind() {
    gl.useProgram(this.program);
  }

}

class Camera {

  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotX = 0;
    this.rotY = 0;

    this.matrixView = create();
  }

  updateMatrix() {
    identity(this.matrixView);
    rotate(this.matrixView, this.matrixView, -Math.PI + this.rotY * Math.PI / 180, [1, 0, 0]);
    rotate(this.matrixView, this.matrixView, -this.rotX * Math.PI / 180, [0, 1, 0]);
    translate(this.matrixView, this.matrixView, [this.x, this.y, this.z]);
  }

}

class Universe {

  constructor() {
    this.camera = new Camera();

    this.canvasCover = 0;

    this.setup();
  }

  setup() {
    this.shader = new Shader();
    this.shader.bind();

    this.setupScreen();
    window.onresize = (event) => this.setupScreen(event);
    /*canvas.onmousemove = (event) => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      const tiltX = (event.clientX - width / 2) / width / 2;
      const tiltY = (event.clientY - height / 2) / height / 2;

      this.camera.rotX = tiltX * 90;
      this.camera.rotY = tiltY * 90;
    }*/

    this.locationCoord = gl.getAttribLocation(this.shader.program, 'a_coords');
    gl.vertexAttribPointer(this.locationCoord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.locationCoord);

    this.locationView = gl.getUniformLocation(this.shader.program, 'u_view');
    this.locationProjection = gl.getUniformLocation(this.shader.program, 'u_projection');

    this.matrixView = create();

    gl.clearColor(0, 0, 0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    this.load();

    window.requestAnimationFrame(() => this.render());
  }

  setupScreen() {
    this.SCALER = 1;
    this.WIDTH = window.innerWidth / this.SCALER;
    this.HEIGHT = window.innerHeight / this.SCALER;

    this.matrixProjection = create();
    perspective(this.matrixProjection, Math.PI / 180 * 70, this.WIDTH / this.HEIGHT, 0.1, 20);

    canvas.width = this.WIDTH;
    canvas.height = this.HEIGHT;

    gl.viewport(0, 0, this.WIDTH, this.HEIGHT);
  }

  load() {
    var vertices = [];

    for (var z = 0; z < 20; z++) {
      for (var x = 0; x < 10; x++) {
        const vx = Math.random() * 20 - 10;
        const vy = Math.random() * 20 - 10;

        vertices.push(...[
          vx, vy, z + 5,
          vx, vy, z + 6,
        ]);
      }
    }
    vertices.forEach((v, i) => vertices.push(v + (i % 3 == 2 ? 20 : 0)));

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.uniformMatrix4fv(this.locationProjection, false, this.matrixProjection);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(this.locationCoord, 3, gl.FLOAT, false, 0, 0);
  }

  render() {
    if (this.canvasCover !== 0) {
      gl.clear(gl.COLOR_BUFFER_BIT);

      this.camera.z -= 0.3;
      this.camera.updateMatrix();

      gl.uniformMatrix4fv(this.locationView, false, this.camera.matrixView);

      gl.drawArrays(gl.LINES, 0, 800);

      if (this.camera.z < -20) this.camera.z = 0;
    }

    window.requestAnimationFrame(() => this.render());
  }
}

module.exports = new Universe();
