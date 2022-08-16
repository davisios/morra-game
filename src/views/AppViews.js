import React from 'react';
import { toStandardCurrency } from '../helpers';

export class Wrapper extends React.Component {
  render() {
    const { app } = this.props;
    return (
      <div className="app hcenter vcenter">
          {app}
      </div>
    );
  }
}

export class ConnectAccount extends React.Component {
  render() {
    const { parent } = this.props;
    const { state } = parent;
    return (
      <div className='hcenter' style={{ flexDirection: "column", width: "100%", textAlign: "center" }}>
        <div>
          Please connect to your Algorand account to continue
        </div>
        {state.accErr ? <div>
          <div >
            A problem ocurr while trying to connect to you account, please try again
            <br></br>
            <button onClick={() => parent.retryConnectWallet()}>
              Connect
            </button>
          </div></div> : null}
      </div>

    )
  }
}

export class SelectRole extends React.Component {
  render() {
    const { parent } = this.props;
    return (
      <div className='hcenter' style={{ flexDirection: "column", width: "100%", textAlign: "center" }}>
        <br />
        <button
          onClick={() => parent.selectAlice()}>
          Create game
        </button>
        <button
          onClick={() => parent.selectBob()}>
          Join game
        </button>
      </div>
    );
  }


}
export class WaitingforTurn extends React.Component {
  render() {
    const { parent } = this.props;
    return (
      <div className='hcenter' style={{ flexDirection: "column", width: "100%", textAlign: "center" }}>
        Please wait while the other player finish his turn ......
      </div>
    );
  }
}

export class GetNumbers extends React.Component {
  render() {
 
    const { parent } = this.props;
    const {numbers, error} = (this.state || {});
    const setNumber=(e)=>{
      if(numbers>5 ||numbers<0){
this.setState({error: 'You can not play less than 0 and more than 5'})
      }else{
        parent.resolveGetNumbers(numbers)
      }
    };
    return (
      <div className='hcenter' style={{ flexDirection: "column", width: "100%", textAlign: "center" }}>
       {error}
       <br></br>
        How many fingers will you play (0-5)?
        <input
          type='number'
          min="0"
          max='5'
          onChange={(e) => this.setState({ numbers: e.currentTarget.value })}
        />
        <br />
        <button className="setwager"
          onClick={() => setNumber()}
        >Play fingers!</button>
      </div>
    );
  }
}

export class GuessNumbers extends React.Component {
  render() {
    const { parent } = this.props;
    const numbers = (this.state || {}).numbers;
    const setNumber=(e)=>{
      if(numbers>5 ||numbers<0){
this.setState({error: 'You can not play less than 0 and more than 10'})
      }else{
    parent.resolveGuessNumbers(numbers)}
    };
    return (
      <div className='hcenter' style={{ flexDirection: "column", width: "100%", textAlign: "center" }}>
        How many fingers do you think are in total  (0-10)?
        <input
          type='number'
          min="0"
          max='10'
          onChange={(e) => this.setState({ numbers: e.currentTarget.value })}
        />
        <br />
        <button className="setwager"
          onClick={() => setNumber()}
  
        >Ok!</button>
      </div>
    );
  }
}
export class InformRoundEnd extends React.Component {
  render() {
    const { parent } = this.props;
    const { total, currentAPoints, currentBPoints, aWon, bWon } = parent.state;
    const aDidWon = parseInt(aWon) > 0;
    const bDidWon = parseInt(bWon) > 0;
    return (
      <div className='hcenter' style={{ flexDirection: "column", width: "100%", textAlign: "center" }}>
        Round finished, the total amount of fingers for this round was {parseInt(total)}
        <br></br>
        Alice {aDidWon ? 'won 1 point this round' : 'did not win any point this round'}
        <br></br>
        Alice points = {parseInt(currentAPoints)}
        <br></br>
        Bob {bDidWon ? 'won 1 point this round' : 'did not win any point this round'}
        <br></br>
        Bob points = {parseInt(currentBPoints)}
      </div>
    );
  }
}

export class FinishMorra extends React.Component {
  render() {
    const { parent } = this.props;
    const { winner, isAlice, balance} = parent.state;
    const result = parseInt(winner);
    const getResult = () => {
      switch (result) {
        case 1:
          return 'Game finished, result: tie'
        case 2:
          return `Game finished, result: ${isAlice?'you':'Alice'} won`
        case 3:
          return `Game finished, result: ${!isAlice?'you':'Bob'} won`


      }
    }
    return (
      <div className='hcenter' style={{ flexDirection: "column", width: "100%", textAlign: "center" }}>
        {getResult()}
        <br></br>
        Your new balance is :{toStandardCurrency(balance)}
      </div>
    );
  }
}


export class InformTimeout extends React.Component {
  render() {
    return (
      <div className='hcenter' style={{ flexDirection: "column", width: "100%", textAlign: "center" }}>
       Contract timeout, finishing game!
      </div>
    );
  }
}


