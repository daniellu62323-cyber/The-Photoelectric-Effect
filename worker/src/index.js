/* Deployment spike — NOT the quiz backend.
 *
 * This exists to answer one question before anything is built on top of it:
 * can a SQLite-backed Durable Object be deployed to this account through
 * Workers Builds, with no Node installed locally, and can a browser open a
 * WebSocket to it?
 *
 * If the answer is no, the design in BACKEND_STRUCTURE.md changes - we fall
 * back to Firebase - and that decision has to be made BEFORE quiz.html is
 * written against a transport that may not exist.
 *
 * There is deliberately no quiz logic here. Room state, players, scores and
 * the answer key all come later, once this is known to work.
 */

export class Room {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('Room is alive. Open a WebSocket to /ws to talk to it.\n', {
        headers: { 'content-type': 'text/plain' }
      });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    /* acceptWebSocket, not server.accept: the Hibernation API lets the object
       sleep between messages, which is most of a fifteen-minute presentation. */
    this.state.acceptWebSocket(server);

    return new Response(null, { status: 101, webSocket: client });
  }

  /* Echo, so the spike can prove a round trip end to end. */
  async webSocketMessage(ws, message) {
    ws.send(JSON.stringify({ type: 'echo', received: message, at: Date.now() }));
  }

  async webSocketClose(ws, code, reason, wasClean) {
    ws.close(code, reason);
  }

  async webSocketError(ws, error) {
    /* Nothing to recover here during a spike; the close is the signal. */
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response('photoelectric spike: ok\n', {
        headers: { 'content-type': 'text/plain' }
      });
    }

    if (url.pathname === '/ws') {
      /* One object per room code, so each run of the quiz gets an empty one
         by construction. "spike" is the only room this file will ever see. */
      const room = url.searchParams.get('room') || 'spike';
      const id = env.ROOM.idFromName(room);
      return env.ROOM.get(id).fetch(request);
    }

    return new Response('not found\n', { status: 404 });
  }
};
