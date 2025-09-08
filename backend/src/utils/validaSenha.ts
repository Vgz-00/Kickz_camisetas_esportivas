export function validaSenha(senha: string) {
    
    const mensagem: string[] = []

    if (senha.length < 8) {
        mensagem.push("Erro.. senha deve possuir, no minimo 8 caracteres")
    }

    let pequenas = 0
    let grandes = 0
    let nums = 0
    let simbolos = 0  
    
    for (const letra of senha) {
    // expressão regular
    if ((/[a-z]/).test(letra)) {
      pequenas++
    }
    else if ((/[A-Z]/).test(letra)) {
      grandes++
    }
    else if ((/[0-9]/).test(letra)) {
      nums++
    } else {
      simbolos++
    }
  }

  if (pequenas == 0) {
    mensagem.push("Erro... senha deve possuir letra(s) minúscula(s)")
  }

  if (grandes == 0) {
    mensagem.push("Erro... senha deve possuir letra(s) maiúscula(s)")
  }

  if (nums == 0) {
    mensagem.push("Erro... senha deve possuir número(s)")
  }

  if (simbolos == 0) {
    mensagem.push("Erro... senha deve possuir símbolo(s)")
  }

 return {
    isValid: mensagem.length === 0,
    erros: mensagem,
  };
}

