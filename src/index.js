import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import init from './init.jsx';
import reportWebVitals from './reportWebVitals';

const app = () => {
  const virtualDom = init();
  ReactDOM.render(virtualDom, document.getElementById('root')
  );
};

app();



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
