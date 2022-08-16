import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as AppViews from './views/AppViews';
import * as AliceViews from './views/AliceViews';
import * as BobViews from './views/BobViews';
import * as backend from './build/index.main.mjs';
import { ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';
import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib('ALGO');
reach.setWalletFallback(reach.walletFallback( { providerEnv: 'TestNet', MyAlgoConnect } ));

const {standardUnit} = reach;
const defaultWager = '0.001';

const aliceViews = {
  BackendRunning: AliceViews.BackendRunning,
  SetWager: AliceViews.SetWager,
  
};

const bobViews = {
  RunBackend: BobViews.RunBackend,
  AcceptWager: BobViews.AcceptWager,
  
};
const appViews = {
  WaitingforTurn: AppViews.WaitingforTurn,
  GetNumbers: AppViews.GetNumbers,
  GuessNumbers: AppViews.GuessNumbers,
  InformRoundEnd: AppViews.InformRoundEnd,
  WaitingforTurn: AppViews.WaitingforTurn,
  FinishMorra: AppViews.FinishMorra,
  InformTimeout: AppViews.InformTimeout,
  ConnectAccount: AppViews.ConnectAccount,
  SelectRole: AppViews.SelectRole

};

const player =(t)=> { return {
  random: () => reach.hasRandom.random(),
  getNumbers:()=>{
    return  new Promise(getNumbers => {
      t.setState({ mode: 'GetNumbers',  getNumbers });
    })
  },
  guessNumbers:()=>{
    return  new Promise(guessNumbers => {
      t.setState({ mode: 'GuessNumbers',  guessNumbers });
    })
  },
  informRoundEnd:(total,currentAPoints, currentBPoints,aWon, bWon)=>{
    t.setState({ mode: 'InformRoundEnd',  total,currentAPoints, currentBPoints,aWon, bWon});
  },
  informTimeout:() => {
    t.setState({ mode: 'InformTimeout'});
  },
  finishMorra:async(winner)=>{
    const balance = await reach.balanceOf(t.props.acc)
    t.setState({ mode: 'FinishMorra',  winner, balance});
    
  }
}
};

function renderDOM() {
  ReactDOM.render(
    <React.StrictMode><App /></React.StrictMode>,
    document.getElementById('root')
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mode: 'ConnectAccount'}
  }
  
  async retryConnectWallet(){ 
    const acc = await reach.getDefaultAccount();
      const balAtomic = await reach.balanceOf(acc);
      const bal = reach.formatCurrency(balAtomic, 4);
      const addr = await acc.networkAccount.getAddress;
      this.setState({acc, bal, accErr:false});
      this.setState({mode: 'SelectRole',addr, acc, bal});
  }

  async componentDidMount() {
    try {
     await this.retryConnectWallet();
    } catch (error) {
    this.setState({accErr: true});
    }
  }
  
  selectRole(role) { 
    this.setState({mode: 'RunRole', role}); } 
  selectBob() { this.selectRole(<Bob acc={this.state.acc} />); }
  selectAlice() {
     this.selectRole(<Alice acc={this.state.acc} />); }
  render() {
    const {mode, role} = this.state;
    const parent = this;
    let app = null;
    if(appViews[mode]){
      const Component = appViews[mode];
      app = <Component {...{ parent}} />;
    }else{
      app = role;
    }
    return <AppViews.Wrapper {...{app}} />;
  }
}


class Alice extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mode: 'SetWager', isAlice:true};
  }
  async componentDidMount(){
    const ctc = await this.props.acc.contract(backend);
    this.setState({ctc});
    const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
    this.setState({ctcInfoStr});
  }

  resolveGetNumbers(number){
    this.state.getNumbers(number);
  }

  resolveGuessNumbers(number){
    this.state.guessNumbers(number);
    this.setState( {mode: 'WaitingforTurn'});

  }
  async setWager(requestStandard) { 
    this.setState({ requestStandard}); 
    const {ctc} = this.state;
    this.setState({mode: 'BackendRunning'});
    const wager = reach.parseCurrency(requestStandard);
    await backend.Alice(ctc, {
      ...player(this),
      wager ,deadline:40, 
  });
   
  } 
  render() {
    let alice = null;
    const parent = this;
    const {mode, ctcInfoStr} = this.state;
    if(aliceViews[mode]){
      const MyComponent = aliceViews[mode];
      alice = <MyComponent {...{ parent,ctcInfoStr, standardUnit, defaultWager }} />;
    }else if (appViews[mode]){
      var MyComponent = appViews[mode];
      alice = <MyComponent {...{ parent}} />;
    }

    return <AliceViews.AliceWrapper ctcInfo={ctcInfoStr} {...{alice}} />
  }
}

class Bob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mode: 'RunBackend',  isAlice:false, loading:false};
  }
  resolveGetNumbers(number){
    this.state.getNumbers(number);
  }

  setLoading(loading){
    this.setState({loading})
  }

  resolveGuessNumbers(number){
    this.state.guessNumbers(number);
    this.setState( {mode: 'WaitingforTurn'});
  }
  async runBackend(ctcInfoStr) { // from mode: RunBackend
    try{
      const ctcInfo = JSON.parse(ctcInfoStr);
      const ctc = this.props.acc.contract(backend, ctcInfo);
      await backend.Bob(ctc, {
        ...player(this),
        acceptWager: (wager)=>{
          return  new Promise(resolveAcceptWager => {
      this.setState({ mode: 'AcceptWager', wager, resolveAcceptWager, loading:false});
          });
            },
      });
    }catch(e){
      this.setState({ connectError:true });
    }
   
  }
  async resolveAcceptWager(){
    this.state.resolveAcceptWager();
    this.setState( {mode: 'WaitingforTurn'});
    this.setLoading(false);
  };

  render() {
    let bob = null;
    const parent = this;
    const {mode, wager} = this.state;
    if(bobViews[mode]){
      const MyComponent = bobViews[mode];
      bob = <MyComponent {...{ parent, wager }} />;
    }
    else if(appViews[mode]){
      const MyComponent = appViews[mode];
      bob = <MyComponent {...{ parent }} />;
    }
    return <BobViews.BobWrapper {...{bob}} />;
  }
}

renderDOM();