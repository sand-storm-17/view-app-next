import React, { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";

const mockWalletPublicKey = "ABCD1234EFGH5678IJKL9012MNOP3456QRST7890";

export function ProfileDropdown() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("anonymous");
  const [newUsername, setNewUsername] = useState<string>("");
  const [newProfilePic, setNewProfilePic] = useState<string | null>(null);
  const [showUpdateProfile, setShowUpdateProfile] = useState<boolean>(false);

  const handleProfileUpdate = () => {
    if (newUsername) {
      setUsername(newUsername);
    }
    if (newProfilePic) {
      setProfilePic(newProfilePic);
    }
    toast.success("Profile updated successfully!");
    setShowUpdateProfile(false);
  };

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-ghost btn-circle avatar">
        {profilePic ? (
          <img src={profilePic} alt="Profile" className="w-10 rounded-full" />
        ) : (
          <MdAccountCircle size={44} />
        )}
        <span className="text-xs ml-2"></span>
      </button>
      <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 space-y-2">
        <li>
          <a>Username: {username}</a>
        </li>
        <li>
          <CopyToClipboard
            text={mockWalletPublicKey}
            onCopy={() => toast.success("Copied to clipboard!")}
          >
            <a>
              Wallet: <span className="text-xs">{mockWalletPublicKey}</span>
            </a>
          </CopyToClipboard>
        </li>
        <li>
          <a>
            <button>Coins</button>
          </a>
        </li>
        <li>
          <button>Create Your Coin</button>
        </li>
        <li>
          <button onClick={() => setShowUpdateProfile(true)}>
            Update Profile
          </button>
        </li>
      </ul>

      {showUpdateProfile && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Update Profile</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="New Username"
                className="input input-bordered w-full"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setNewProfilePic(event.target?.result as string);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleProfileUpdate}>
                Save
              </button>
              <button
                className="btn"
                onClick={() => setShowUpdateProfile(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
