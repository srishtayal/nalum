import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/context/AuthContext';
import AdminAuthContextProvider from '@/context/AdminAuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import VerificationPrompt from '@/components/alumniVerify/VerificationPrompt';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import EventsPage from '@/pages/admin/EventsPage';
import NewslettersPage from '@/pages/admin/NewslettersPage';
import UsersPage from '@/pages/admin/UsersPage';
import VerificationPage from '@/pages/admin/VerificationPage';
import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import OtpVerificationPage from '@/pages/OtpVerificationPage';
import ProfileForm from '@/pages/ProfileForm';
import Root from '@/pages/Root';
import SignUp from '@/pages/SignUp';

const queryClient = new QueryClient();
function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<AdminAuthContextProvider>
					<TooltipProvider>
							<Routes>
								<Route path="/" element={<Root />}>
									<Route index element={<HomePage />} />
									<Route path="/login" element={<Login />} />
									<Route path="/signup" element={<SignUp />} />
									<Route path="/verify-otp" element={<OtpVerificationPage />} />
									<Route
										path="/profile-creation"
										element={(
											<ProtectedRoute>
												<ProfileForm />
											</ProtectedRoute>
										)}
									/>
									<Route
										path="/alumni-verification"
										element={(
											<ProtectedRoute>
												<VerificationPrompt />
											</ProtectedRoute>
										)}
									/>
								</Route>

								<Route path="/admin/login" element={<AdminLoginPage />} />
								<Route
									path="/admin"
									element={(
										<AdminProtectedRoute>
											<AdminLayout />
										</AdminProtectedRoute>
									)}
								>
									<Route index element={<AdminDashboard />} />
									<Route path="users" element={<UsersPage />} />
									<Route path="events" element={<EventsPage />} />
									<Route path="newsletters" element={<NewslettersPage />} />
									<Route path="verification" element={<VerificationPage />} />
								</Route>

								<Route path="*" element={<NotFound />} />
							</Routes>
						<Toaster />
					</TooltipProvider>
				</AdminAuthContextProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
