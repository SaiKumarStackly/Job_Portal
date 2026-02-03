import React, { useState, useRef } from 'react'
import './MyProfile.css'
import { Link } from 'react-router-dom';
import addPhoto from '../assets/AddPhoto.png'
import editIcon from '../assets/EditIcon.png'
import uploadIcon from '../assets/UploadIcon.png'
import deleteIcon from '../assets/DeleteIcon.png'
import { JHeader } from './JHeader';

// --- REUSABLE COMPONENTS ---

const EditableListItem = ({ title, onEdit }) => (
    <div className="skill-item">
        <span>{title}</span>
        <button type="button" onClick={onEdit} className="edit-skill-btn">
            <img className='edit-icon-btn' src={editIcon} alt='edit' />
        </button>
    </div>
);

const PopupModal = ({ title, isOpen, onClose, onSave, onDelete, mode, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button type="button" className="close-modal" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-actions">
                    <button type="button" className="btn btn-primary btn-full" onClick={onSave}>Save</button>
                    {mode === 'edit' ? (
                        <button type="button" className="btn btn-danger btn-full" onClick={onDelete}>Delete</button>
                    ) : (
                        <button type="button" className="btn btn-danger btn-full" onClick={onClose}>Cancel</button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- FORM SECTIONS ---

const Profile = ({ data, onChange, onReset, onNext }) => {
    const [errors, setErrors] = useState({});
    const AlphaOnlyreg = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const today = new Date().toISOString().split('T')[0];
    const handleChange = (e) => {
        onChange(e);
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        
        
        if (!data.fullName?.trim()) newErrors.fullName = "*Full Name is required";
        else if (!AlphaOnlyreg.test(data.fullName)) newErrors.fullName = "*Please use letters only; no spaces or numbers allowed";
        if (data.gender === "Select") newErrors.gender = "*Please select a gender";
        if (!data.dob) newErrors.dob = "*Date of Birth is required";
        else if (data.dob > today) newErrors.dob = "*Date cannot be in the future";
        if (data.maritalStatus === "Select") newErrors.maritalStatus = "*Please select status";
        if (!data.nationality?.trim()) newErrors.nationality = "*Nationality is required";
        
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onNext();
        } else {
            alert("Please fill all required fields.");
        }
    };

    return (
        <form className="content-card" onSubmit={handleSubmit}>
            <div className="profile-header">
                <h2>Profile</h2>
                <button type="button" className="reset-link" onClick={() => { onReset(); setErrors({}); }}>Reset</button>
            </div>
            <div className="profile-layout">
                <div className="photo-uploader">
                    <div className="photo-placeholder">
                        <img className='photo-placeholder-icon' src={addPhoto} alt='upload' />
                        <p>Upload photo</p>
                    </div>
                    <small>Allowed format: </small>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>JPG, JPEG, and PNG</span>
                    <div className="photo-actions">
                        <button type="button" className="photo-btn remove"><img className='upload-icon-btn' src={deleteIcon} alt='delete' /> Remove Photo</button>
                        <button type="button" className="photo-btn upload"><img className='upload-icon-btn' src={uploadIcon} alt='upload' /> Upload Photo</button>
                    </div>
                </div>
                <div className="profile-form">
                    <div className="form-group">
                        <label>Full name</label>
                        <input type="text" name="fullName" value={data.fullName || ''} onChange={handleChange} className={errors.fullName ? 'input-error' : ''} placeholder="Enter full name" />
                        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" value={data.gender || 'Select'} onChange={handleChange} className={errors.gender ? 'input-error' : ''}>
                            <option value="Select">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Not Specified">Not Specified</option>
                        </select>
                        {errors.gender && <span className="error-message">{errors.gender}</span>}
                    </div>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" name="dob" value={data.dob || ''} max={today} onChange={handleChange} className={errors.dob ? 'input-error' : ''} />
                        {errors.dob && <span className="error-message">{errors.dob}</span>}
                    </div>
                    <div className="form-group">
                        <label>Marital Status</label>
                        <select name="maritalStatus" value={data.maritalStatus || 'Select'} onChange={handleChange} className={errors.maritalStatus ? 'input-error' : ''}>
                            <option value="Select">Select</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                        </select>
                        {errors.maritalStatus && <span className="error-message">{errors.maritalStatus}</span>}
                    </div>
                    <div className="form-group">
                        <label>Nationality</label>
                        <input type="text" name="nationality" value={data.nationality || ''} onChange={handleChange} className={errors.nationality ? 'input-error' : ''} placeholder="Enter nationality" />
                        {errors.nationality && <span className="error-message">{errors.nationality}</span>}
                    </div>
                </div>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save & Continue</button>
            </div>
        </form>
    );
};

const CurrentDetails = ({ data, onChange, onReset, onNext }) => {
    const [errors, setErrors] = useState({});
    const handleChange = (e) => { onChange(e); if(errors[e.target.name]) setErrors({...errors, [e.target.name]: ''}); };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!data.jobTitle?.trim()) newErrors.jobTitle = "Required";
        if (!data.company?.trim()) newErrors.company = "Required";
        if (!data.experience) newErrors.experience = "Required";
        if (data.noticePeriod === 'Select') newErrors.noticePeriod = "Required";
        if (!data.currentLocation?.trim()) newErrors.currentLocation = "Required";
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            onNext();
        } else {
            alert("Please fill all required fields.");
        }
    };

    return (
        <form className="content-card" onSubmit={handleSubmit}>
            <div className="profile-header">
                <h2>Current Details</h2>
                <button type="button" className="reset-link" onClick={() => { onReset(); setErrors({}); }}>Reset</button>
            </div>
            <div className="form-grid">
                <div className="form-group"><label>Current Job Title</label><input type="text" name="jobTitle" value={data.jobTitle || ''} onChange={handleChange} className={errors.jobTitle ? 'input-error' : ''} placeholder="e.g., Software Engineer"/></div>
                <div className="form-group"><label>Current Company</label><input type="text" name="company" value={data.company || ''} onChange={handleChange} className={errors.company ? 'input-error' : ''} placeholder="e.g., XYZ Company"/></div>
                <div className="form-group"><label>Total Experience (Years)</label><input type="number" name="experience" min="0" step="0.1" placeholder="e.g. 2.5" value={data.experience || ''} onChange={handleChange} className={errors.experience ? 'input-error' : ''} /></div>
                <div className="form-group"><label>Notice Period</label>
                    <select name="noticePeriod" value={data.noticePeriod || 'Select'} onChange={handleChange} className={errors.noticePeriod ? 'input-error' : ''}>
                        <option value="Select">Select</option><option value="Immediate">Immediate</option><option value="1 Month">1 Month</option><option value="2 Months">2 Months</option><option value="3 Months">3 Months</option>
                    </select>
                </div>
                <div className="form-group full-width"><label>Current Location</label><input type="text" name="currentLocation" value={data.currentLocation || ''} onChange={handleChange} className={errors.currentLocation ? 'input-error' : ''} placeholder="e.g., Bangalore"/></div>
                <div className="form-group full-width"><label>Preferred Location(s)</label><input type="text" name="prefLocation" value={data.prefLocation || ''} onChange={handleChange} placeholder="e.g., Bangalore, Chennai, Coimbatore"/></div>
            </div>
            <div className="form-actions"><button type="submit" className="btn btn-primary">Save & Continue</button></div>
        </form>
    );
};

const ContactDetails = ({ data, onChange, onReset, onNext }) => {
    const [errors, setErrors] = useState({});
    const handleChange = (e) => { onChange(e); if(errors[e.target.name]) setErrors({...errors, [e.target.name]: ''}); };
    const mobileRegex = /^\d{10}$/;
    const Pincode = /^[1-9][0-9]{5}$/
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!data.mobile) newErrors.mobile = "Required";
        else if (!mobileRegex.test(data.mobile)) newErrors.mobile = "Invalid Mobile Number";

        if (data.altMobile && !mobileRegex.test(data.altMobile)) newErrors.altMobile = "Invalid Mobile Number";

        else if (data.mobile.length >0 && data.mobile === data.altMobile) newErrors.altMobile = "Mobile Number Should Not be same";
        if (!data.email) newErrors.email = "Required";
        else if (data.email.length>0 && data.email === data.altEmail) newErrors.altEmail = "Email Should Not be same";
        if (!data.address) newErrors.address = "Required";
        if (!data.country) newErrors.country = "Required";
        if (!data.state) newErrors.state = "Required";
        if (!data.street) newErrors.street = "Required";
        if (!data.pincode) newErrors.pincode = "Required";
        if (!data.city) newErrors.city = "Required";
            else if(!Pincode.test(data.pincode)) newErrors.pincode = "Enter a Valid PinCode";
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onNext();
        } else {
            alert("Please fill all required fields.");
        }
    };

    return (
        <form className="content-card" onSubmit={handleSubmit}>
            <div className="profile-header">
                <h2>Contact Details</h2>
                <button type="button" className="reset-link" onClick={() => { onReset(); setErrors({}); }}>Reset</button>
            </div>
            <div className="form-grid">
                <div className="form-group"><label>Mobile Number</label><input type="tel" name="mobile" value={data.mobile || ''} onChange={handleChange} className={errors.mobile ? 'input-error' : ''} placeholder="Enter phone number"/>
                {errors.mobile && <span className="error-msg">{errors.mobile}</span>}</div>

                <div className="form-group"><label>Alternate Number</label><input type="tel" name="altMobile" value={data.altMobile || ''} onChange={handleChange} placeholder="Enter phone number"/>
                {errors.altMobile && <span className="error-msg">{errors.altMobile}</span>}</div>

                <div className="form-group"><label>Email ID</label><input type="email" name="email" value={data.email || ''} onChange={handleChange} className={errors.email ? 'input-error' : ''} placeholder="Enter email address"/>
                {errors.email && <span className="error-msg">{errors.email}</span>}</div>
                
                <div className="form-group"><label>Alternate Email</label><input type="email" name="altEmail" value={data.altEmail || ''} onChange={handleChange} placeholder="Enter email address"/>
                {errors.altEmail && <span className="error-msg">{errors.altEmail}</span>}</div>
                
                <div className="form-group full-width"><label>Address</label><input type="text" name="address" value={data.address || ''} onChange={onChange} className={errors.address ? 'input-error' : ''} placeholder="Street, City, State, Pincode, Country"/>
                {errors.address && <span className="error-msg">{errors.address}</span>}</div>
                
                <div className="form-group"><label>Street</label><input type="text" name="street" value={data.street || ''} onChange={handleChange} placeholder="e.g., Flat 402"/>
                {errors.street && <span className="error-msg">{errors.street}</span>}</div>
                
                <div className="form-group"><label>City</label><input type="text" name="city" value={data.city || ''} onChange={handleChange} placeholder="e.g., Green Park"/>
                {errors.city && <span className="error-msg">{errors.city}</span>}</div>
                
                <div className="form-group"><label>State</label><input type="text" name="state" value={data.state || ''} onChange={handleChange} placeholder="e.g., Karnataka"/>
                {errors.state && <span className="error-msg">{errors.state}</span>}</div>
                
                <div className="form-group"><label>Pincode</label><input type="text" name="pincode" value={data.pincode || ''} onChange={handleChange} placeholder="e.g., 625601"/>
                {errors.pincode && <span className="error-msg">{errors.pincode}</span>}</div>
                
                <div className="form-group"><label>Country</label><input type="text" name="country" value={data.country || ''} onChange={handleChange} className={errors.country ? 'input-error' : ''} placeholder="e.g., India"/>
                {errors.country && <span className="error-msg">{errors.country}</span>}</div>
            </div>
            <div className="form-actions"><button type="submit" className="btn btn-primary">Save & Continue</button></div>
        </form>
    );
};

const ResumeSection = ({ data, onChange, onReset, onNext }) => (
    <form className="content-card" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
        <div className="profile-header">
            <h2>Resume</h2>
            <button type="button" className="reset-link" onClick={onReset}>Reset</button>
        </div>
        <div className="upload-box">
            <div className="upload-text"><img className='upload-icon-btn' src={uploadIcon} alt='upload' /> Upload Resume</div>
            <small>Allowed formats: PDF, DOC, DOCX</small>
        </div>
        <div className="form-group full-width"><label>Portfolio/Website Link</label><input type="url" name="portfolio" value={data.portfolio || ''} onChange={onChange} placeholder="Enter URL" /></div>
        <div className="form-actions"><button type="submit" className="btn btn-primary">Save & Continue</button></div>
    </form>
);

const EducationDetails = ({ data, onUpdateSSLC, onUpdateHSC, onUpdateGrad, onAddGrad, onRemoveGrad, onReset, onNext }) => {
    const [openSection, setOpenSection] = useState(null);
    const toggleSection = (id) => setOpenSection(openSection === id ? null : id);
    const today = new Date().toISOString().split('T')[0];
    const percentageReg = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)%?$/

 
    const [errors, setErrors] = useState({});
   
 
     const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!data.highestQual || data.highestQual === 'Select') newErrors.highestQual = "Select atleast One";
        if (!data.sslc.institution) newErrors.sslcinstitution = "Required";
        if (!data.sslc.percentage) newErrors.sslcpercentage = "Required";
        else if (!percentageReg.test(data.sslc.percentage)) newErrors.sslcpercentage = "Invalid format";
        if (!data.sslc.location) newErrors.sslclocation = "Required";
        if (!data.sslc.year) newErrors.sslcyear = "Date Of Year Required";
        else if (data.sslc.year > today) {
        newErrors.sslcyear = "Year cannot be in the future";}
 
 
        if (!data.hsc.stream ||data.hsc.stream === 'Select') newErrors.hscstream = 'Select atleast One';
        if (!data.hsc.institution) newErrors.hscinstitution = "Required";
        if (!data.hsc.percentage) newErrors.hscpercentage = "Required";
         else if (!percentageReg.test(data.hsc.percentage)) newErrors.hscpercentage = "Invalid format";
        if (!data.hsc.location) newErrors.hsclocation = "Required";
        if (!data.hsc.year) newErrors.hscyear = "Date Of Year Required";
        else if (data.hsc.year > today) {
        newErrors.hscyear = "Year cannot be in the future";}
   
       
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onNext();
        } else {
            alert("Please fill all required fields.");
        }
    };
 
 
    return (
        <form className="content-card" onSubmit={handleSubmit}>
            <div className="profile-header">
                <h2>Education Details</h2>
                <button type="button" className="reset-link" onClick={onReset}>Reset</button>
            </div>
           
            <div className="form-group full-width" style={{ marginBottom: '1.5rem' }}>
                <label>Highest Qualification?</label>
                <select name="highestQual" value={data.highestQual} onChange={onUpdateSSLC}>
                    <option value="Select">Select</option><option value="Diploma">Diploma</option><option value="Under-Graduation">Under-Graduation</option><option value="Post-Graduation">Post-Graduation</option><option value="Doctorate">Doctorate</option>
                </select>
                {errors.highestQual && <span className="error-msg">{errors.highestQual}</span>}
            </div>
 
            <div className="accordion-wrapper">
                {/* --- SSLC Form --- */}
                <div className="accordion-item">
                    <div className="accordion-header" onClick={() => toggleSection('sslc')}>
                        <span>SSLC</span><span className="accordion-icon">{openSection === 'sslc' ? '-' : '+'}</span>
                    </div>
                    {openSection === 'sslc' && (
                        <div className="accordion-body">
                            <div className="form-grid">
                                <div className="form-group"><label>Name of Institution</label><input type="text" name="institution" value={data.sslc.institution} onChange={onUpdateSSLC} placeholder="e.g., XYZ School" />
                                {errors.sslcinstitution && <span className="error-msg">{errors.sslcinstitution}</span>} </div>
 
                                <div className="form-group"><label>Percentage</label><input type="text" name="percentage" value={data.sslc.percentage} onChange={onUpdateSSLC} placeholder="e.g., 80%" />
                                {errors.sslcpercentage && <span className="error-msg">{errors.sslcpercentage}</span>}</div>
 
                                <div className="form-group"><label>Location</label><input type="text" name="location" value={data.sslc.location} onChange={onUpdateSSLC} placeholder="e.g., Bangalore" />
                                {errors.sslclocation && <span className="error-msg">{errors.sslclocation}</span>}</div>
 
                                <div className="form-group"><label>Year of completion</label><input type="date" name="year" value={data.sslc.year} onChange={onUpdateSSLC} />
                                {errors.sslcyear && <span className="error-msg">{errors.sslcyear}</span>}</div>
                            </div>
                        </div>
                    )}
                </div>
 
                {/* --- HSC Form --- */}
                <div className="accordion-item">
                    <div className="accordion-header" onClick={() => toggleSection('hsc')}>
                        <span>HSC</span><span className="accordion-icon">{openSection === 'hsc' ? '-' : '+'}</span>
                    </div>
                    {openSection === 'hsc' && (
                        <div className="accordion-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>What did you studied after 10th?</label>
                                    <select name="stream" value={data.hsc.stream} onChange={onUpdateHSC}>
                                        <option value="Select">Select</option>
                                        <option value="Intermediate">Intermediate/12</option>
                                        <option value="Diploma">Diploma</option>
                                    </select>
                                    {errors.hscstream && <span className="error-msg">{errors.hscstream}</span>}
                                </div>
                                <div className="form-group"><label>Name of Institution</label><input type="text" name="institution" value={data.hsc.institution} onChange={onUpdateHSC} placeholder="e.g., XYZ School" />
                                 {errors.hscinstitution && <span className="error-msg">{errors.hscinstitution}</span>}</div>
                                <div className="form-group"><label>Location</label><input type="text" name="location" value={data.hsc.location} onChange={onUpdateHSC} placeholder="e.g., Bangalore" />
                                {errors.hsclocation && <span className="error-msg">{errors.hsclocation}</span>}</div>
                                <div className="form-group"><label>Year of completion</label><input type="date" name="year" value={data.hsc.year} onChange={onUpdateHSC} />
                                 {errors.hscyear && <span className="error-msg">{errors.hscyear}</span>}</div>
                                <div className="form-group"><label>Percentage</label><input type="text" name="percentage" value={data.hsc.percentage} onChange={onUpdateHSC} placeholder="e.g., 80%" />
                                {errors.hscpercentage && <span className="error-msg">{errors.hscpercentage}</span>}</div>
                            </div>
                        </div>
                    )}
                </div>
 
                {/* --- Graduation Forms --- */}
                {data.graduations.map((grad, index) => (
                    <div className="accordion-item" key={grad.id}>
                        <div className="accordion-header" onClick={() => toggleSection(`grad-${grad.id}`)}>
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <span>Graduation {index > 0 ? index + 1 : ''}</span>
                            </div>
                            <span className="accordion-icon">{openSection === `grad-${grad.id}` ? '-' : '+'}</span>
                        </div>
                       
                        {openSection === `grad-${grad.id}` && (
                            <div className="accordion-body">
                                {index > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); onRemoveGrad(grad.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <img className='upload-icon-btn' src={deleteIcon} alt='delete' />
                                        </button>
                                    </div>
                                )}
 
                                <div className="form-grid">
                                    <div className="form-group"><label>Degree</label><input type="text" name="degree" value={grad.degree} onChange={(e) => onUpdateGrad(grad.id, e)} placeholder="e.g., B.E" /></div>
                                    <div className="form-group"><label>Degree status</label><select name="status" value={grad.status} onChange={(e) => onUpdateGrad(grad.id, e)}><option value="Select">Select</option><option value="Completed">Completed</option><option value="Pursuing">Pursuing</option></select></div>
                                    <div className="form-group"><label>Department</label><input type="text" name="dept" value={grad.dept} onChange={(e) => onUpdateGrad(grad.id, e)} placeholder="e.g., Computer Science" /></div>
                                    <div className="form-group"><label>Percentage</label><input type="text" name="percentage" value={grad.percentage} onChange={(e) => onUpdateGrad(grad.id, e)} placeholder="%" /></div>
                                    <div className="form-group"><label>Starting year</label><input type="date" name="startYear" value={grad.startYear} onChange={(e) => onUpdateGrad(grad.id, e)} /></div>
                                    <div className="form-group"><label>Ending year</label><input type="date" name="endYear" value={grad.endYear} onChange={(e) => onUpdateGrad(grad.id, e)} /></div>
                                    <div className="form-group full-width"><label>Institution name</label><input type="text" name="college" value={grad.college} onChange={(e) => onUpdateGrad(grad.id, e)} placeholder="e.g., XYZ Institute" /></div>
                                    <div className="form-group"><label>City</label><input type="text" name="city" value={grad.city} onChange={(e) => onUpdateGrad(grad.id, e)} placeholder="e.g., Green park" /></div>
                                    <div className="form-group"><label>State</label><input type="text" name="state" value={grad.state} onChange={(e) => onUpdateGrad(grad.id, e)} placeholder="e.g., Tamil Nadu" /></div>
                                    <div className="form-group"><label>Country</label><input type="text" name="country" value={grad.country} onChange={(e) => onUpdateGrad(grad.id, e)} placeholder="e.g., India" /></div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
           
            <button type="button" className="add-link" onClick={onAddGrad}>+ Add Education</button>
            <div className="form-actions"><button type="submit" className="btn btn-primary">Save & Continue</button></div>
        </form>
    );
};

const WorkExperience = ({ data, onChange, onUpdateEntry, onAddEntry, onRemoveEntry, onReset, onNext }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.status === 'Experienced') {
           
            const isValid = data.entries.every(entry => entry.title && entry.company);
            if (!isValid) {
                alert("Please fill in Job Title and Company for all entries.");
                return;
            }
        }
        onNext();
    };

    return (
    <form className="content-card" onSubmit={handleSubmit}>
        <div className="profile-header">
            <h2>Work Experience</h2>
            <button type="button" className="reset-link" onClick={onReset}>Reset</button>
        </div>
        <div className="form-grid">
            <div className="form-group"><label>Current Status</label><select name="status" value={data.status || 'Fresher'} onChange={onChange}><option value="Fresher">Fresher</option><option value="Experienced">Experienced</option></select></div>
            <div className="form-group"><label>Do you have any internship or work experience?</label><select name="hasExperience" value={data.hasExperience || 'No'} onChange={onChange}><option value="No">No</option><option value="Yes">Yes</option></select></div>
        </div>
        
        {data.status === 'Experienced' && (
            <>
                {data.entries.map((entry, index) => (
                    <div key={entry.id} style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Company {index + 1}</h4>
                            <button type="button" onClick={() => onRemoveEntry(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <img className='upload-icon-btn' src={deleteIcon} alt='delete' />
                            </button>
                        </div>
                        <div className="form-grid">
                            <div className="form-group"><label>Job Title</label><input type="text" name="title" value={entry.title} onChange={(e) => onUpdateEntry(entry.id, e)} placeholder="e.g., Software Engineer"/></div>
                            <div className="form-group"><label>Company Name</label><input type="text" name="company" value={entry.company} onChange={(e) => onUpdateEntry(entry.id, e)} placeholder="e.g., XYZ Company"/></div>
                            <div className="form-group"><label>Start Date</label><input type="date" name="startDate" value={entry.startDate} onChange={(e) => onUpdateEntry(entry.id, e)} /></div>
                            <div className="form-group"><label>End Date</label><input type="date" name="endDate" value={entry.endDate} onChange={(e) => onUpdateEntry(entry.id, e)} /></div>
                            
                            <div className="form-group">
                                <label>Industry / Domain</label>
                                <select name="industry" value={entry.industry} onChange={(e) => onUpdateEntry(entry.id, e)}>
                                    <option value="Select">Select</option>
                                    <option value="IT">IT - Software</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Education">Education</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Job Type</label>
                                <select name="jobType" value={entry.jobType} onChange={(e) => onUpdateEntry(entry.id, e)}>
                                    <option value="Select">Select</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" name="location" value={entry.location} onChange={(e) => onUpdateEntry(entry.id, e)} placeholder="e.g., Bangalore" />
                            </div>
                            <div className="form-group">
                                <label>Key Responsibilities / Achievements</label>
                                <input type="text" name="responsibilities" value={entry.responsibilities} onChange={(e) => onUpdateEntry(entry.id, e)} placeholder="Type..." />
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" className="add-link" onClick={onAddEntry}>+ Add another</button>
            </>
        )}
        
        <div className="form-actions"><button type="submit" className="btn btn-primary">Save & Continue</button></div>
    </form>
    );
};

const KeySkills = ({ skills, onAdd, onUpdate, onDelete, onReset, onNext }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null); 
    const [currentSkill, setCurrentSkill] = useState("");

    const openAdd = () => { setEditIndex(null); setCurrentSkill(""); setIsModalOpen(true); };
    const openEdit = (index) => { setEditIndex(index); setCurrentSkill(skills[index]); setIsModalOpen(true); };

    const handleSave = () => {
        if (currentSkill.trim()) {
            if (editIndex !== null) onUpdate(editIndex, currentSkill);
            else onAdd(currentSkill);
            setIsModalOpen(false);
        }
    };

    const handleDelete = () => { if (editIndex !== null) { onDelete(editIndex); setIsModalOpen(false); } };
    const handleReset=()=>{
        if (onReset) {
    onReset('skills'); 
  }
    };
    

    return (
        <form className="content-card" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
            <div className="profile-header">
                <h2>Key skills</h2>
                <button type="button" className="reset-link" onClick={handleReset}>Reset</button>
            </div>
            <div className="skills-list">
                {skills.map((skill, index) => (<EditableListItem key={index} title={skill} onEdit={() => openEdit(index)} />))}
            </div>
            <button type="button" className="add-link" onClick={openAdd}>+ Add another skill</button>
            <div className="form-actions"><button type="submit" className="btn btn-primary">Save & Continue</button></div>
            <PopupModal title={editIndex !== null ? "Edit Skill" : "Add Skill"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} onDelete={handleDelete} mode={editIndex !== null ? 'edit' : 'add'}>
                <div className="form-group"><label>Skill *</label><input type="text" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} placeholder="Enter Skill" /></div>
            </PopupModal>
        </form>
    );
};

const LanguagesKnown = ({ languages, onAdd, onUpdate, onDelete, onReset, onNext }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [currentLang, setCurrentLang] = useState({ name: "", proficiency: "Select" });

    const openAdd = () => { setEditIndex(null); setCurrentLang({ name: "", proficiency: "Select" }); setIsModalOpen(true); };
    const openEdit = (index) => { setEditIndex(index); setCurrentLang(languages[index]); setIsModalOpen(true); };

    const handleSave = () => {
        if (currentLang.name.trim()) {
            if (editIndex !== null) onUpdate(editIndex, currentLang);
            else onAdd(currentLang);
            setIsModalOpen(false);
        }
    };

    const handleDelete = () => { if (editIndex !== null) { onDelete(editIndex); setIsModalOpen(false); } };

    return (
        <form className="content-card" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
            <div className="profile-header">
                <h2>Languages Known</h2>
                <button type="button" className="reset-link" onClick={onReset}>Reset</button>
            </div>
            <div className="skills-list">
                {languages.map((lang, index) => (<EditableListItem key={index} title={lang.name} onEdit={() => openEdit(index)} />))}
            </div>
            <button type="button" className="add-link" onClick={openAdd}>+ Add another</button>
            <div className="form-actions"><button type="submit" className="btn btn-primary">Save & Continue</button></div>
            <PopupModal title={editIndex !== null ? "Edit Language" : "Add Language"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} onDelete={handleDelete} mode={editIndex !== null ? 'edit' : 'add'}>
                <div className="form-group" style={{marginBottom:'1rem'}}><label>Language Name *</label><input type="text" value={currentLang.name} onChange={(e) => setCurrentLang({...currentLang, name: e.target.value})} placeholder="e.g., English" /></div>
                <div className="form-group"><label>Proficiency</label><select value={currentLang.proficiency} onChange={(e) => setCurrentLang({...currentLang, proficiency: e.target.value})}><option value="Select">Select</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Fluent">Fluent</option><option value="Native">Native</option></select></div>
            </PopupModal>
        </form>
    );
};

const Certifications = ({ certs, onAdd, onUpdate, onDelete, onReset, onNext }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [currentCert, setCurrentCert] = useState({ name: "", file: null });

    const openAdd = () => { setEditIndex(null); setCurrentCert({ name: "", file: null }); setIsModalOpen(true); };
    const openEdit = (index) => { setEditIndex(index); setCurrentCert(certs[index]); setIsModalOpen(true); };

    const handleSave = () => {
        if (currentCert.name.trim()) {
            if (editIndex !== null) onUpdate(editIndex, currentCert);
            else onAdd(currentCert);
            setIsModalOpen(false);
        }
    };

    const handleDelete = () => { if (editIndex !== null) { onDelete(editIndex); setIsModalOpen(false); } };

    return (
        <form className="content-card" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
            <div className="profile-header">
                <h2>Certifications</h2>
                <button type="button" className="reset-link" onClick={onReset}>Reset</button>
            </div>
            <div className="skills-list">
                {certs.map((cert, index) => (<EditableListItem key={index} title={cert.name} onEdit={() => openEdit(index)} />))}
            </div>
            <button type="button" className="add-link" onClick={openAdd}>+ Add another certification</button>
            <div className="form-actions"><button type="submit" className="btn btn-primary">Save & Continue</button></div>
            <PopupModal title={editIndex !== null ? "Edit Certification" : "Add Certification"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} onDelete={handleDelete} mode={editIndex !== null ? 'edit' : 'add'}>
                <div className="form-group" style={{marginBottom:'1rem'}}><label>Certification Name *</label><input type="text" value={currentCert.name} onChange={(e) => setCurrentCert({...currentCert, name: e.target.value})} placeholder="e.g., Full-stack development" /></div>
                <div className="form-group"><label>Upload Certificate (PDF, PNG, JPEG)</label><div style={{border:'1px solid #ddd', padding:'8px', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#fff'}}><span style={{color: currentCert.file ? '#333' : '#999', fontSize:'0.9rem'}}>{currentCert.file ? "File Selected" : "Not Uploaded"}</span><span style={{fontSize:'1.2rem', color:'#666'}}>⋮</span></div></div>
            </PopupModal>
        </form>
    );
};

// --- FINAL SUBMIT BUTTON SECTION ---
const Preferences = ({ data, onChange, onReset,onSubmitFinal }) => {
    const NumRegix = /[^0-9]/;
    const [errors, setErrors] = useState({});
    const handleSubmit = (e) => {
       
        const newErrors = {};
        if (!data.currentCTC) newErrors.currentCTC = "Required";
         else if(NumRegix.test(data.currentCTC)) newErrors.currentCTC ="Salary in Numbers" ;

        if (!data.expectedCTC) newErrors.expectedCTC = "Required";
            else if(NumRegix.test(data.expectedCTC)) newErrors.expectedCTC ="Salary in Numbers" ;
        if (!data.jobType || data.jobType === 'Select') {
            newErrors.jobType = "Please select a job type";}
        if (!data.role) newErrors.role = "Required";
        if (!data.ready) newErrors.ready = "Please select your availability";
        if (!data.relocate) newErrors.relocate = "Please select relocation preference";
   
       
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
         onSubmitFinal()
        } else {
            
        }
    };
    
    return (
    <form className="content-card" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="profile-header">
            <h2>Preferences / Career Details</h2>
            <button type="button" className="reset-link" onClick={onReset}>Reset</button>
        </div>
        <div className="form-grid">
            <div className="form-group"><label>Current CTC</label><input type="text" name="currentCTC" value={data.currentCTC} onChange={onChange} placeholder='Enter your Current CTC'/>
            {errors.currentCTC && <span className="error-msg">{errors.currentCTC}</span>}</div>
            <div className="form-group"><label>Expected CTC</label><input type="text" name="expectedCTC" value={data.expectedCTC} onChange={onChange} placeholder='Enter your Expected CTC'/>
            {errors.expectedCTC && <span className="error-msg">{errors.expectedCTC}</span>}</div>  
            <div className="form-group"><label>Preferred Job Type</label><select name="jobType" value={data.jobType} onChange={onChange}><option value="Select">Select</option><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Internship">Internship</option><option value="Contract">Contract</option></select>
            {errors.jobType && <span className="error-msg">{errors.jobType}</span>}</div>  
            <div className="form-group"><label>Preferred Industry/Role</label><input type="text" name="role" value={data.role || ''} onChange={onChange} placeholder='Enter preferred industry/role'/>
            {errors.role && <span className="error-msg">{errors.role}</span>}</div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: "column" , gap: '2rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex' , gap: '12rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', fontSize: '0.9rem' }}>Ready to work</label>
                    <small>Inform employers that you’re available to begin immediately.</small>
                     {errors.ready && <span className="error-msg">{errors.ready}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: "center" , gap: '1.5rem' }}>
                    <label style={{display:'flex', gap:'5px', cursor:'pointer'}}><input type="radio" name="ready" value="Yes" checked={data.ready === "Yes"} onChange={onChange} /> Yes</label>
                    <label style={{display:'flex', gap:'5px', cursor:'pointer'}}><input type="radio" name="ready" value="No" checked={data.ready === "No"} onChange={onChange} /> No</label>
                    
                </div>
            </div>
            <div style={{ display: 'flex' , gap: '12rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '500', fontSize: '0.9rem' }}>Willing to Relocate</label>
                    <small>Inform employers that you’re available to begin immediately.</small>
                    {errors.relocate && <span className="error-msg">{errors.relocate}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: "center" , gap: '1.5rem' }}>
                    <label style={{display:'flex', gap:'5px', cursor:'pointer'}}><input type="radio" name="relocate" value="Yes" checked={data.relocate === "Yes"} onChange={onChange} /> Yes</label>
                    <label style={{display:'flex', gap:'5px', cursor:'pointer'}}><input type="radio" name="relocate" value="No" checked={data.relocate === "No"} onChange={onChange} /> No</label>
                </div>
            </div>
        </div>

        <div className="form-actions"><button type="submit"  className="btn btn-primary">Save & Continue</button></div>
    </form>
)};

// --- MAIN COMPONENT ---

export const MyProfile = () => {
    const [openDropdown, setOpenDropdown] = useState('Basic Details');
    const [activeItem, setActiveItem] = useState('Profile');

    // ORDER of Steps for Navigation
    const steps = [
        'Profile', 
        'Current Details', 
        'Contact Details', 
        'Resume', 
        'Education Details', 
        'Work Experience', 
        'Key Skills', 
        'Languages Known', 
        'Certifications', 
        'Preferences / Career Details'
    ];

    const [allData, setAllData] = useState({
        profile: { fullName: '', gender: 'Select', dob: '', maritalStatus: 'Select', nationality: '' },
        currentDetails: { jobTitle: '', company: '', experience: '', currentLocation: '', prefLocation: '' },
        contact: { mobile: '', altMobile: '', email: '', altEmail: '', address: '', street: '', city: '', state: '', pincode: '', country: '' },
        resume: { portfolio: '' },
        education: { highestQual: 'Select', sslc: { institution: '', percentage: '', location: '', year: '' }, hsc: { stream: 'Select', institution: '', location: '', year: '', percentage: '' }, graduations: [{ id: 1, degree: '', status: 'Select', dept: '', percentage: '', startYear: '', endYear: '', college: '', city: '', state: '', country: '' }] },
        experience: { status: 'Fresher', hasExperience: 'No', entries: [{ id: 1, title: '', company: '', startDate: '', endDate: '', industry: 'Select', jobType: 'Select', location: '', responsibilities: '' }] },
        skills: ["User Research", "Problem solving", "Figma"],
        languages: [{ name: "English", proficiency: "Fluent" }, { name: "Tamil", proficiency: "Native" }],
        certs: [{ name: "Full-Stack Development", file: "cert1.pdf" }, { name: "UI/UX Design", file: "cert2.pdf" }],
        preferences: [{ currentCTC: '', expectedCTC: '', jobType: 'Select', role: '', ready: '', relocate: '' }]
    });

    // --- NAVIGATION LOGIC ---
    const handleNextStep = () => {
        const currentIndex = steps.indexOf(activeItem);
        if (currentIndex < steps.length - 1) {
            const nextItem = steps[currentIndex + 1];
            setActiveItem(nextItem);
            
            // Auto-open Dropdowns
            if (['Profile', 'Current Details', 'Contact Details'].includes(nextItem)) setOpenDropdown('Basic Details');
            else if (['Key Skills', 'Languages Known', 'Certifications'].includes(nextItem)) setOpenDropdown('Skills & Certifications');
        }
    };

   const handleFinalSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const AlphaOnlyreg =  /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const percentageReg = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)%?$/;



    // --- 1. Current Details VALIDATION ---
    
    
    // --- 2. PROFILE VALIDATION ---
    const profile = allData.profile;
    const isProfileValid = 
        profile.fullName?.trim() && 
        AlphaOnlyreg.test(profile.fullName) &&
        profile.gender !== "Select" &&
        profile.dob && 
        profile.dob <= today &&
        profile.maritalStatus !== "Select" &&
        profile.nationality?.trim();

    if (!isProfileValid) {
        alert("*fill the Required field in the Profile section.");
        return;
    }

    const CurrentDetails = allData.currentDetails;
    const isCurrentdetailsValid = 
        CurrentDetails.company.trim() &&
        CurrentDetails.currentLocation.trim() &&
        CurrentDetails.experience &&
        CurrentDetails.jobTitle.trim() &&
        CurrentDetails.prefLocation.trim()
        

    if (!isCurrentdetailsValid) {
        alert("*fill the Required field in the Current Details section.");
        return;
    }

    // --- 2. EDUCATION VALIDATION ---
    const edu = allData.education;
    const isSslcValid = 
        edu.sslc.institution && 
        edu.sslc.location && 
        edu.sslc.year && 
        edu.sslc.year <= today &&
        percentageReg.test(edu.sslc.percentage);

    const isHscValid = 
        edu.hsc.stream !== 'Select' &&
        edu.hsc.institution &&
        edu.hsc.year &&
        edu.hsc.year <= today &&
        percentageReg.test(edu.hsc.percentage);

    if (!isSslcValid || !isHscValid) {
        alert( "*required SSLC and HSC details with valid percentages and years.");
        return;
    }
     const Contactdetails = allData.contact;
    const isContactdetailsValid = 
        Contactdetails.email.trim() &&
        Contactdetails.mobile &&
        Contactdetails.altMobile &&
        Contactdetails.email &&
        Contactdetails.altEmail &&
        Contactdetails.city.trim() &&
        Contactdetails.country.trim() &&
        Contactdetails.state.trim() &&
        Contactdetails.street.trim() &&
        Contactdetails.pincode
        

    if (!isContactdetailsValid) {
        alert("*fill the Required field in the Contact Details section");
        return;
    }

    // --- 3. WORK EXPERIENCE VALIDATION ---
    const work = allData.experience;
    let isWorkValid = true;
    if (work.status === 'Experienced') {
        // Check if all entries have the core required fields
        isWorkValid = work.entries.every(entry => 
            entry.title?.trim() !== "" && entry.company?.trim() !== ""
        );
    }

    if (!isWorkValid) {
        alert("*Work experience details Required.");
        return;
    }
 
    // const Preferences = allData.preferences;
    // let IsPreferencesValid = true;
    // if (Preferences.currentCTC === '') {
    //     IsPreferencesValid = Preferences.entries.every(pref => 
    //         pref.currentCTC?.trim() !=="" &&  pref.expectedCTC?.trim() !== ""
    //     );
    // }

    // if (!isWorkValid) {
    //     alert("*Work experience details Required.");
    //     return;
    // }
    // --- FINAL EXECUTION ---
    if (isProfileValid && isSslcValid && isHscValid && isWorkValid ) {
        console.log("FINAL SUBMISSION DATA:", allData);
       
        alert("Your profile has been saved successfully!");
    }
};

    const handleUpdate = (section, e) => {
        const { name, value } = e.target;
        setAllData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
    };

    // --- Education Handlers ---
    const handleUpdateSSLC = (e) => {
        const { name, value } = e.target;
        if(name === 'highestQual') setAllData(prev => ({ ...prev, education: { ...prev.education, highestQual: value } }));
        else setAllData(prev => ({ ...prev, education: { ...prev.education, sslc: { ...prev.education.sslc, [name]: value } } }));
    };
    const handleUpdateHSC = (e) => {
        const { name, value } = e.target;
        setAllData(prev => ({ ...prev, education: { ...prev.education, hsc: { ...prev.education.hsc, [name]: value } } }));
    };
    const handleUpdateGrad = (id, e) => {
        const { name, value } = e.target;
        setAllData(prev => ({ ...prev, education: { ...prev.education, graduations: prev.education.graduations.map(grad => grad.id === id ? { ...grad, [name]: value } : grad) } }));
    };
    const handleAddGrad = () => {
        const newGrad = { id: Date.now(), degree: '', status: 'Select', dept: '', percentage: '', startYear: '', endYear: '', college: '', city: '', state: '', country: '' };
        setAllData(prev => ({ ...prev, education: { ...prev.education, graduations: [...prev.education.graduations, newGrad] } }));
    };
    const handleRemoveGrad = (id) => {
        setAllData(prev => ({ ...prev, education: { ...prev.education, graduations: prev.education.graduations.filter(grad => grad.id !== id) } }));
    };

    // --- Experience Handlers ---
    const handleExpUpdateEntry = (id, e) => {
        const { name, value } = e.target;
        setAllData(prev => ({ ...prev, experience: { ...prev.experience, entries: prev.experience.entries.map(entry => entry.id === id ? { ...entry, [name]: value } : entry) } }));
    };
    const handleAddExpEntry = () => setAllData(prev => ({ ...prev, experience: { ...prev.experience, entries: [...prev.experience.entries, { id: Date.now(), title: '', company: '', startDate: '', endDate: '', industry: 'Select', jobType: 'Select', location: '', responsibilities: '' }] } }));
    const handleRemoveExpEntry = (id) => setAllData(prev => ({ ...prev, experience: { ...prev.experience, entries: prev.experience.entries.filter(entry => entry.id !== id) } }));

    // --- List Handlers ---
    const handleArrayAdd = (key, item) => setAllData(prev => ({ ...prev, [key]: [...prev[key], item] }));
    const handleArrayUpdate = (key, index, item) => { const newList = [...allData[key]]; newList[index] = item; setAllData(prev => ({ ...prev, [key]: newList })); };
    const handleArrayDelete = (key, index) => { const newList = [...allData[key]]; newList.splice(index, 1); setAllData(prev => ({ ...prev, [key]: newList })); };

    // --- Reset Handler (Resets only CURRENT section) ---
    const handleReset = (section) => {
        const defaults = {
            profile: { fullName: '', gender: 'Select', dob: '', maritalStatus: 'Select', nationality: '' },
            currentDetails: { jobTitle: '', company: '', experience: '', currentLocation: '', prefLocation: '' },
            contact: { mobile: '', altMobile: '', email: '', altEmail: '', address: '', street: '', city: '', state: '', pincode: '', country: '' },
            resume: { portfolio: '' },
            education: { highestQual: 'Select', sslc: { institution: '', percentage: '', location: '', year: '' }, hsc: { stream: 'Select', institution: '', location: '', year: '', percentage: '' }, graduations: [{ id: Date.now(), degree: '', status: 'Select', dept: '', percentage: '', startYear: '', endYear: '', college: '', city: '', state: '', country: '' }] },
            skills :[],
            experience: { status: '', hasExperience: 'No', entries: [{ id: Date.now(), title: '', company: '', startDate: '', endDate: '', industry: 'Select', jobType: 'Select', location: '', responsibilities: '' }] },
            preferences: { currentCTC: '', expectedCTC: '', jobType: 'Select', role: '', ready: '', relocate: '' },
            languages:[],
            certs:[],
            

        };

        if ([].includes(section))
             return;

        setAllData(prev => ({ ...prev, [section]: defaults[section] }));


    };

    const handleDropdownClick = (title) => setOpenDropdown(openDropdown === title ? null : title);
    const handleItemClick = (title, parent = null) => { setActiveItem(title); if (parent) setOpenDropdown(parent); };

    const menuItems = [
        { title: 'Basic Details', subItems: ['Profile', 'Current Details', 'Contact Details'] },
        { title: 'Resume' },
        { title: 'Education Details' },
        { title: 'Work Experience' },
        { title: 'Skills & Certifications', subItems: ['Key Skills', 'Languages Known', 'Certifications'] },
        { title: 'Preferences / Career Details' },
    ];

    const renderContent = () => {
        switch (activeItem) {
            case 'Profile': return <Profile data={allData.profile} onChange={(e) => handleUpdate('profile', e)} onReset={() => handleReset('profile')} onNext={handleNextStep} />;
            case 'Current Details': return <CurrentDetails data={allData.currentDetails} onChange={(e) => handleUpdate('currentDetails', e)} onReset={() => handleReset('currentDetails')} onNext={handleNextStep} />;
            case 'Contact Details': return <ContactDetails data={allData.contact} onChange={(e) => handleUpdate('contact', e)} onReset={() => handleReset('contact')} onNext={handleNextStep} />;
            case 'Resume': return <ResumeSection data={allData.resume} onChange={(e) => handleUpdate('resume', e)} onReset={() => handleReset('resume')} onNext={handleNextStep} />;
            case 'Education Details': return <EducationDetails data={allData.education} onUpdateSSLC={handleUpdateSSLC} onUpdateHSC={handleUpdateHSC} onUpdateGrad={handleUpdateGrad} onAddGrad={handleAddGrad} onRemoveGrad={handleRemoveGrad} onReset={() => handleReset('education')} onNext={handleNextStep} />;
            case 'Work Experience': return <WorkExperience data={allData.experience} onChange={(e) => handleUpdate('experience', e)} onUpdateEntry={handleExpUpdateEntry} onAddEntry={handleAddExpEntry} onRemoveEntry={handleRemoveExpEntry} onReset={() => handleReset('experience')} onNext={handleNextStep} />;
            case 'Key Skills': return <KeySkills skills={allData.skills} onAdd={(item) => handleArrayAdd('skills', item)} onUpdate={(idx, item) => handleArrayUpdate('skills', idx, item)} onDelete={(idx) => handleArrayDelete('skills', idx)} onReset={() => handleReset('skills')} onNext={handleNextStep} />;
            case 'Languages Known': return <LanguagesKnown languages={allData.languages} onAdd={(item) => handleArrayAdd('languages', item)} onUpdate={(idx, item) => handleArrayUpdate('languages', idx, item)} onDelete={(idx) => handleArrayDelete('languages', idx)} onReset={() => handleReset('languages')} onNext={handleNextStep} />;
            case 'Certifications': return <Certifications certs={allData.certs} onAdd={(item) => handleArrayAdd('certs', item)} onUpdate={(idx, item) => handleArrayUpdate('certs', idx, item)} onDelete={(idx) => handleArrayDelete('certs', idx)} onReset={() => handleReset('certs')} onNext={handleNextStep} />;
            
            // Final Step -> Submit
            case 'Preferences / Career Details': return <Preferences data={allData.preferences} onChange={(e) => handleUpdate('preferences', e)} onReset={() => handleReset('preferences')} onSubmitFinal={handleFinalSubmit} />;
            default: return <Profile data={allData.profile} onChange={(e) => handleUpdate('profile', e)} onReset={() => handleReset('profile')} onNext={handleNextStep} />;
        }
    };

    return (
        <div>
            <JHeader/>
            <main>
                <div className='profile-main-desc'>
                    <h1>My Profile</h1>
                    <p>Build and update your profile with personal, education, and career details to connect with the right opportunities.</p>
                </div>
                <div className="profile-main-content">
                    <aside className="sidebar">
                        {menuItems.map(item => {
                            const isParentActive = item.subItems ? item.subItems.includes(activeItem) : activeItem === item.title;
                            return (
                                <div key={item.title}>
                                    <div className={`sidebar-item ${item.subItems ? 'has-submenu' : ''} ${item.subItems && openDropdown === item.title ? 'open' : ''} ${isParentActive ? 'active-main' : ''}`} onClick={() => item.subItems ? handleDropdownClick(item.title) : handleItemClick(item.title)}>
                                        {item.title}
                                        {item.subItems && <span className="arrow"></span>}
                                    </div>
                                    {item.subItems && openDropdown === item.title && (
                                        <div className="submenu">
                                            {item.subItems.map(subItem => (
                                                <div key={subItem} className={`submenu-item ${activeItem === subItem ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); handleItemClick(subItem, item.title); }}>
                                                    <span className="dot">•</span> {subItem}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </aside>
                    <section className="content-area">{renderContent()}</section>
                </div>
            </main>
            <footer className='myprofile-footer'>© 2025 JobPortal. All rights reserved.</footer>
        </div>
    )
}