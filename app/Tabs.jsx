import Login from "./(auth)/login"
import Register from "./(auth)/register"

function Tabs() {
  return (
    
    <div className='w-150 pl-50 pt-40 pb-50 '>
      <div className='shadow-lg bg-transparent border-1 rounded-md' >
        <ul  id="myTab" className="nav nav-tabs justify-center" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active " id="home-tab"  type="button" role="tab" 
                    data-bs-toggle="tab" data-bs-target="#home" aria-controls="home" aria-selected="true">
              Sign In
              </button>
          </li>
          <li className=" " role="presentation">
            <button 
            className="nav-link" 
            id="profile-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#profile" 
            type="button" 
            role="tab" 
            aria-controls="profile" 
            aria-selected="false"
            >
              Sign Up
            </button>
          </li>
        </ul>
        <div  id="myTabContent" className="tab-content">
          <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab"><Login/></div>
          <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab"><Register/></div>
        </div>
      </div>
      
    </div>
  );
}

export default Tabs;