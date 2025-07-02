import Homepage from "../../../frontend/src/page/Homepage";
import About from "../../../frontend/src/page/About";
import History from "../../../frontend/src/page/History";
import Game from "../../../frontend/src/page/Game";

const allRouter = [
  {
    path: '/',
    name: 'Homepage',
    component: <Homepage />,
  }, {
    path: '/about',
    name: 'About',
    component: <About />,
  }, {
    path: '/history',
    name: 'History',
    component: <History />,
  }, {
    path: '/game',
    name: 'Game',
    component: <Game />,
  }
];


export default allRouter;
