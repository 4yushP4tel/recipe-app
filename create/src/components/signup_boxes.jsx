export function Signup_Box(){
    return (
        <div className="signupcontainer">
            
            <h2>Sign Up</h2>
            <form>
                <div>
                    <label htmlFor="">Email</label>
                    <input type="text" 
                    required
                    />
                </div>

                <div>
                    <label htmlFor="">Password</label>
                    <input type="text" 
                    required
                    />
                </div>
                <button>SignUp</button>
            </form>
        </div>
    );
}

export function Create_Account(){
    return(
        <div className="create_acc_container">

        </div>
    );
}