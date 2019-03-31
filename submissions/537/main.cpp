//{{{
#include <bits/stdc++.h>
using namespace std;
#define rep(...) repN((__VA_ARGS__,rep3,rep2,loop,~))(__VA_ARGS__)
#define loop(n) rep2(_loop_,n)
#define rep2(i,n) rep3(i,0,n)
#define rep3(i,begin,end) for(int i=(int)(begin),i##_end=(int)(end);i<i##_end;++i)
#define repN(a) repX a
#define repX(a0,a1,a2,x,...) x
typedef long long ll;
const int MOD = 1e9+7;
//}}}

int main(){
	ll N;
	cin >> N;
	set<string> st;
	rep(x, 1, 1000001){
		if(N < (ll)x * x) break;
		if(N % x == 0){
			string a = to_string(x);
			string b = to_string(N / x);
			st.insert(a + b);
			st.insert(b + a);
		}
	}
	cout << st.size() << endl;
	return 0;
}
