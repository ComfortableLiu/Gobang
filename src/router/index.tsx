import Homepage from "@/page/Homepage";
import About from "@/page/About";
import History from "@/page/History";
import Game from "@/page/Game";

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
