'reach 0.1';
const [ isOutcome, B_WINS, DRAW, A_WINS ] = makeEnum(3);

const getWinner=(A, B)=>{
if(A==B){
    return DRAW
}else if( A==3){
    return A_WINS
}else{
    return B_WINS
    
}
}
const winner=(numsAlice, numsBob, guessNumsAlice, guessNumsBob)=>{
  const totalNumbers = numsAlice+numsBob;
  const A = guessNumsAlice==totalNumbers ? 1 : 0;
  const B = guessNumsBob==totalNumbers ? 1 : 0;
  return [A, B]
};

const Player = {
    ...hasRandom,
    informTimeout: Fun([], Null),
    informRoundEnd: Fun([UInt,UInt,UInt,UInt,UInt], Null),
    finishMorra: Fun([UInt], Null),
guessNumbers: Fun([], UInt),
getNumbers: Fun([], UInt),
};

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    ...Player,
    wager: UInt, 
    deadline: UInt
  });
  const Bob   = Participant('Bob', {
    ...Player,
    acceptWager: Fun([UInt], Null),
  });
  init();

  const informTimeout = () => {
    each([Alice, Bob], () => {
      interact.informTimeout();
    });
  };

  const informRoundEnd = (total, currentAPoints, currentBPoints, aWon, bWon) => {
    each([Alice, Bob], () => {
      interact.informRoundEnd(total,currentAPoints, currentBPoints,aWon, bWon);
    });
  };
 
  Alice.only(() => {
    const wager = declassify(interact.wager);
    const deadline = declassify(interact.deadline);
  });
  Alice.publish(wager, deadline)
    .pay(wager);
  commit();

  Bob.only(() => {
    interact.acceptWager(wager);
  });
  Bob.pay(wager)
    .timeout(relativeTime(deadline), () => closeTo(Alice, informTimeout));
    
var [A_GUESSES, B_GUESSES] = [0,0];
  invariant( balance() == 2 * wager );
  while ( A_GUESSES<3 && B_GUESSES<3 ) {
    commit();
    Alice.only(() => {
        const _numbersAlice = interact.getNumbers();
        const guessNumbersAlice = declassify(interact.guessNumbers());
        const [_commitAlice, _saltAlice] = makeCommitment(interact, _numbersAlice);
        const commitAlice = declassify(_commitAlice);
      });
      Alice.publish(commitAlice, guessNumbersAlice)
        .timeout(relativeTime(deadline), () => closeTo(Bob, informTimeout));
      commit();
  
      unknowable(Bob, Alice(_numbersAlice, _saltAlice));
      Bob.only(() => {
        const numbersBob = declassify(interact.getNumbers());
        const guessNumbersBob = declassify(interact.guessNumbers());
    });
      Bob.publish(numbersBob, guessNumbersBob)
        .timeout(relativeTime(deadline), () => closeTo(Alice, informTimeout));
      commit();
  
      Alice.only(() => {
        const saltAlice = declassify(_saltAlice);
        const numbersAlice = declassify(_numbersAlice);
      });
      Alice.publish(saltAlice, numbersAlice)
        .timeout(relativeTime(deadline), () => closeTo(Bob, informTimeout));
      checkCommitment(commitAlice, saltAlice, numbersAlice);
    
     const [A, B] = winner(numbersAlice, numbersBob, guessNumbersAlice, guessNumbersBob);
     informRoundEnd(numbersAlice+numbersBob, A_GUESSES+A, B_GUESSES+B, A, B);
     [A_GUESSES, B_GUESSES]=[A_GUESSES+A, B_GUESSES+B];
      continue;
    }

  
    const tranferWinner = getWinner(A_GUESSES, B_GUESSES);
    each([Alice, Bob], () => {
        interact.finishMorra(tranferWinner);
      });
    if(tranferWinner== DRAW){
        transfer(wager).to(Bob);
        transfer(wager).to(Alice);
    }else {
        transfer(2 * wager).to(tranferWinner == A_WINS ? Alice : Bob);
    }
  commit();

});