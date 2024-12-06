import { authInfoStore } from '../stores/auth.ts'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import './login.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY
const supabase = createClient(supabaseUrl,supabaseKey)

export async function signOut() {
  await supabase.auth.signOut()
}

//--------------------------------------------------------------------------------------------------------------------------------------
function EnrollMFA() {
  
  const [factorId, setFactorId] = useState('')
  const [qr, setQR] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState('')

  const onEnableClicked = () => {
    setError('')
    ;(async () => {
      const challenge = await supabase.auth.mfa.challenge({ factorId })
      if (challenge.error) {
        setError(challenge.error.message)
        throw challenge.error
      }

      const challengeId = challenge.data.id

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      })
      if (verify.error) {
        setError(verify.error.message)
        throw verify.error
      }

    })()
  }

  useEffect(() => {(async () => {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: authInfoStore.email,
      })
      if (error) {
        throw error
      }

      setFactorId(data.id)

      authInfoStore.setId(data.id)
      setQR(data.totp.qr_code)
      console.log(data.totp.secret)
    })()
  }, [])

  return (
    <div className='totp'>
      {error && <div className="error">{error}</div>}
      <img src={qr} />
      <input
        type="text"
        value={verifyCode}
        onChange={(e) => setVerifyCode(e.target.value.trim())}
      />
      <input type="button" value="Enable" onClick={onEnableClicked} />
    </div>
  )
}


//--------------------------------------------------------------------------------------------------------------------------------------
function AuthMFA() {
    const [verifyCode, setVerifyCode] = useState('')
    const [error, setError] = useState('')
    const [level, setLevel] = useState('')
    const [enabled, setEnabled] = useState(false)
  
    useEffect(()=>{
        setLevel('aal1')
        authInfoStore.setLevel('aal1')
    }, [])

    useEffect(() => {(async () => {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error) {
        throw error
      }
      if(data.totp[0].id) {
        setEnabled(true)
      }
    })()
    }, [])


    if(!enabled) {
      return (
        <EnrollMFA></EnrollMFA>
      )
    }

    const onSubmitClicked = () => {
      setError('')
      ;(async () => {
        const factors = await supabase.auth.mfa.listFactors()
        if (factors.error) {
          throw factors.error
        }
  
        const totpFactor = factors.data.totp[0]
  
        if (!totpFactor) {
          throw new Error('No TOTP factors found!')
        }
  
        const factorId = totpFactor.id
  
        const challenge = await supabase.auth.mfa.challenge({ factorId })
        if (challenge.error) {
          setError(challenge.error.message)
          throw challenge.error
        }
  
        const challengeId = challenge.data.id
  
        const verify = await supabase.auth.mfa.verify({
          factorId,
          challengeId,
          code: verifyCode,
        })
        if (verify.error) {
          setError(verify.error.message)
          throw verify.error
        }
        else {
          const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
          if (data?.currentLevel === 'aal2') {
            setLevel('aal2')
          }
        }
      })()
    }

    if(level == 'aal2') {
        return (
            <Login></Login>
        )
    }

    return (
      <div className='totp'>
        <div>Please enter the code from your authenticator app.</div>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value.trim())}
        />
        <input type="button" value="Submit" onClick={onSubmitClicked} />
      </div>
    )
  }


//---------------------------------------------------------------------------------------------------------------------------------------
export default function Login() {
    const [usermail, setUsermail] = useState('')
    const [loginlvl, setLoginlvl] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN") {
          authInfoStore.setLevel('aal1')
          navigate("/");
        }
      });
  
      return () => subscription.unsubscribe();
    }, [navigate]);

    supabase.auth.getSession().then((result) => {
        const session = result.data.session;
        
        if (session != null) {
            authInfoStore.setEmaill(session.user.email || '');
            setUsermail(session.user.email || '')
            console.log(session.user.email)
        }
    })
    supabase.auth.mfa.getAuthenticatorAssuranceLevel().then( (result) => {
        if(!result.error) {
            authInfoStore.setLevel(result.data.currentLevel || '')
            setLoginlvl(result.data.currentLevel || '')
            console.log(result.data.currentLevel)
        }
    })

    if (loginlvl == '') {
        return (
          <div className='container'>
            <Auth supabaseClient={supabase} redirectTo="https://fullstack-projekti.onrender.com/" providers={["github"]} showLinks={false} appearance={{ theme: ThemeSupa }} />
          </div>
      )
    }
    if (loginlvl == 'aal1') {
        return (
          <div className='container'>
            <AuthMFA></AuthMFA>
          </div>
        )
    }
    if (loginlvl == 'aal2') {
        return (
            <div id="login">
                <h2>Kirjautuminen onnistui kaksivaiheisesti!</h2>
                <h3>Käyttäjä: {usermail}, Kirjautumistaso: {loginlvl}</h3>
            </div>
        )
    }
    else {
        return (
            <div id="login">
                <h2>Tänne ei pitäisi koskaan päätyä</h2>
            </div>
        )
    }
    
}