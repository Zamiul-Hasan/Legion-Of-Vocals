import { Link } from "react-router-dom";
import Container from "../UI/Container";
import founderAvatar from "../../assets/images/characters/founder-avatar.png";

function ProjectContributors({ contributors }) {
  return (
    <section className="bg-slate-950 py-20">
      <Container>
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Contributors
        </h2>

        {contributors.length === 0 ? (
          <p className="text-center text-gray-400">
            Contributors will be announced soon.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributors.map((person) => {
              const targetProfile = person.username
                ? `/team/${person.username}`
                : person.memberId === "LOV-2026-0001"
                ? "/team/ovi"
                : null;

              const CardWrapper = targetProfile ? Link : "div";
              const wrapperProps = targetProfile
                ? { to: targetProfile, title: `View ${person.memberName}'s profile` }
                : {};

              return (
                <CardWrapper
                  key={person.id}
                  {...wrapperProps}
                  className="block bg-slate-900 border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400 transition duration-300 hover:-translate-y-1 group"
                >
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-2 border-cyan-500 shadow-lg shadow-cyan-500/20 bg-slate-950">
                    <img
                      src={person.avatar || founderAvatar}
                      alt={person.memberName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = founderAvatar;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="mt-5 text-center text-xl font-bold text-white group-hover:text-cyan-300 transition">
                    {person.memberName}
                  </h3>

                  {/* Role */}
                  <p className="text-center text-cyan-400 mt-2 font-medium">
                    {person.role}
                  </p>

                  {/* Character */}
                  {person.character && (
                    <p className="text-center text-gray-300 mt-2 text-sm">
                      Character:{" "}
                      <span className="font-semibold text-white">
                        {person.character}
                      </span>
                    </p>
                  )}

                  {/* Member ID */}
                  <p className="text-center text-gray-500 text-sm mt-4 font-mono">
                    Member ID: #{person.memberId}
                  </p>
                </CardWrapper>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

export default ProjectContributors;